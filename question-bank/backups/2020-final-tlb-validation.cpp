// Read-only numeric audit for q-36cdda52cd922bd2. Does not read/write bank files.
// g++ -O3 2020-final-tlb-validation.cpp -o tlb-validation && ./tlb-validation
#include <algorithm>
#include <cassert>
#include <cstdio>
#include <vector>

struct FastLRU {
    int prev[1600], next[1600], head=-1, tail=-1, count=0, capacity;
    bool resident[1600]={};
    long long misses=0;
    explicit FastLRU(int cap): capacity(cap) {}
    void touch(int page) {
        assert(page>=0 && page<1600);
        if (!resident[page]) {
            ++misses;
            resident[page]=true;
            if (count==capacity) {
                const int old=tail;
                tail=prev[old];
                if (tail>=0) next[tail]=-1;
                resident[old]=false;
            } else ++count;
        } else {
            if (page==head) return;
            const int left=prev[page], right=next[page];
            if (left>=0) next[left]=right;
            if (right>=0) prev[right]=left; else tail=left;
        }
        prev[page]=-1;
        next[page]=head;
        if (head>=0) prev[head]=page;
        head=page;
        if (tail<0) tail=page;
    }
};

struct SlowLRU {
    std::vector<int> recent;
    int capacity;
    long long misses=0;
    explicit SlowLRU(int cap): capacity(cap) {}
    void touch(int page) {
        auto found=std::find(recent.begin(), recent.end(), page);
        if (found==recent.end()) {
            ++misses;
            if ((int)recent.size()==capacity) recent.pop_back();
        } else recent.erase(found);
        recent.insert(recent.begin(),page);
    }
};

template<class Cache> long long simulate(int n, int mode, int capacity) {
    Cache cache(capacity);
    const int size=n*n;
    for (int outer=0; outer<n; ++outer)
        for (int middle=0; middle<n; ++middle)
            for (int inner=0; inner<n; ++inner) {
                int i=0,j=0,k=0;
                if(mode==0) i=outer,j=middle,k=inner; // ijk
                if(mode==1) j=outer,i=middle,k=inner; // jik
                if(mode==2) j=outer,k=middle,i=inner; // jki
                if(mode==3) k=outer,j=middle,i=inner; // kji
                if(mode==4) k=outer,i=middle,j=inner; // kij
                if(mode==5) i=outer,k=middle,j=inner; // ikj
                if(mode<2) {
                    cache.touch((i*n+k)/512);
                    cache.touch((size+k*n+j)/512);
                    if(k==n-1) cache.touch((2*size+i*n+j)/512);
                } else if(mode<4) {
                    if(i==0) cache.touch((size+k*n+j)/512);
                    cache.touch((i*n+k)/512);
                    cache.touch((2*size+i*n+j)/512);
                } else {
                    if(j==0) cache.touch((i*n+k)/512);
                    cache.touch((size+k*n+j)/512);
                    cache.touch((2*size+i*n+j)/512);
                }
            }
    return cache.misses;
}

int main() {
    for(int n: {8,16,30,64}) {
        for(int capacity: {2,4,64}) {
            std::printf("n=%d capacity=%d:",n,capacity);
            for(int mode=0;mode<6;++mode) {
                const auto fast=simulate<FastLRU>(n,mode,capacity);
                const auto slow=simulate<SlowLRU>(n,mode,capacity);
                assert(fast==slow);
                if(capacity==64) assert(fast==(3*n*n+511)/512);
                std::printf(" %lld",fast);
            }
            std::puts(" (fast/slow equal)");
        }
    }
    const long long expected[]={134480384,134742016,268697600,268697600,524800,263168};
    for(int mode=0;mode<6;++mode) {
        const auto value=simulate<FastLRU>(512,mode,64);
        assert(value==expected[mode]);
        std::printf("n=512 mode=%d misses=%lld\n",mode,value);
    }
}
