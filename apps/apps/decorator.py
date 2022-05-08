from datetime import datetime

def TIME_MEASURE(function):
    def wrapper(*args, **kwargs):
        start = datetime.now()
        ret = function(*args, **kwargs)
        end = datetime.now()
        print("요청된 작업이 %.4f초 소요 됐습니다." % ((end-start).total_seconds()))
        return ret
    
    return wrapper