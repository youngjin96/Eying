'''
웹 서비스 정책에 대한 설정 파일
'''
import datetime


# PDF 보관 기간
def deadline(days=7):
    return (datetime.datetime.now()+datetime.timedelta(days=days)).strftime("%Y-%m-%d")

# 가입 크레딧
ENROLL_CREDIT = 0