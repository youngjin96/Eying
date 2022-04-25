from datetime import datetime

def TIME_MEASURE(function):
    def wrapper(*args, **kwargs):
        start = datetime.now()
        ret = function(*args, **kwargs)
        end = datetime.now()
        print("Time lapsed: ", (end-start).total_seconds(), "s")
        return ret
    
    return wrapper