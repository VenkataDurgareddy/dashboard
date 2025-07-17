from collections import defaultdict
from threading import Lock

# Thread-safe dictionary for call counts
call_counts = defaultdict(int)
lock = Lock()

def increment_call(path: str):
    with lock:
        call_counts[path] += 1

def get_call_stats():
    with lock:
        return dict(call_counts)
