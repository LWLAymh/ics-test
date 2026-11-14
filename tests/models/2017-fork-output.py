"""Independent event enumeration: fork + guaranteed notifications, read, print, wait.

This validates the expressly restricted teaching model, not unconstrained POSIX.
Each round's two delivered signals precede either process's reads. Read and print
are separate events, and wait is after the parent's print. Each fresh letter fd
starts at zero. The independent signal counters are not inferred from answer keys.
"""
from functools import lru_cache

NUMBERS = '123456789012345678901234567890'
LETTERS = 'abcdefghijklmnopqrstuvwxyz'
# process = (iteration, counter1, counter2, phase, child id, captured number)
# phase: fork, read, print, wait, done; ids are vector positions.


def outcomes(n, child_exit, signal_a, signal_b):
    def notify(c1, c2, sig):
        return (c1 + (sig == 1), c2 + (sig == 2))

    @lru_cache(None)
    def visit(procs, offset, last, count):
        if all(p[3] == 'done' for p in procs):
            return frozenset([(count, last)])
        results = set()
        for pid, p in enumerate(procs):
            i, c1, c2, phase, child, buf = p
            new = list(procs)
            if phase == 'fork':
                if i >= n:
                    new[pid] = (i, c1, c2, 'done', -1, '')
                else:
                    pc1, pc2 = notify(c1, c2, signal_b)
                    cc1, cc2 = notify(c1, c2, signal_a)
                    new[pid] = (i, pc1, pc2, 'read', len(new), '')
                    new.append((i, cc1, cc2, 'read', -1, ''))
            elif phase == 'read':
                new[pid] = (i, c1, c2, 'print', child,
                            NUMBERS[offset:offset+c1])
                results.update(visit(tuple(new), offset+c1, last, count))
                continue
            elif phase == 'print':
                new[pid] = (i, c1, c2, 'wait', child, '')
                line = buf + ' ' + LETTERS[:c2]
                results.update(visit(tuple(new), offset, line, count+1))
                continue
            elif phase == 'wait':
                if child >= 0:
                    if procs[child][3] != 'done':
                        continue
                    new[pid] = (i+1, c1, c2, 'fork', -1, '')
                elif child_exit:
                    new[pid] = (i, c1, c2, 'done', -1, '')
                else:
                    new[pid] = (i+1, c1, c2, 'fork', -1, '')
            else:
                continue
            results.update(visit(tuple(new), offset, last, count))
        return frozenset(results)

    found = visit(((0, 1, 1, 'fork', -1, ''),), 0, '', 0)
    return {rows for rows, line in found}, {line for rows, line in found}, visit.cache_info()


if __name__ == '__main__':
    for n, child_exit in [(2, False), (3, True)]:
        for a, b in [(1, 1), (1, 2), (2, 1), (2, 2)]:
            rows, lines, stats = outcomes(n, child_exit, a, b)
            assert rows == {6}
            print(f'N={n}, exit={child_exit}, A={a}, B={b}, rows={rows}, last={sorted(lines)}; states={stats.currsize}')
