'''
웹 서비스 정책에 대한 설정 파일
'''
import datetime


'''
PDF 관련 서비스 정책
'''
# PDF 보관 기간
def DEADLINE(days=7):
    return (datetime.datetime.now()+datetime.timedelta(days=days)).strftime("%Y-%m-%d")

# PDF 보관 기간 초과 시 접근 가능 여부
OVERDUE_ACCESS = True

# 가입 크레딧
ENROLL_CREDIT = 100


'''
REST API 설정 관련
'''
# 데이터 정렬 규칙
def ORDER_BY_RECENT(data):
    return data.order_by('-pk')
    
# 요청 데이터 이름 영한 변환
QUERY_NAME_MATCH = {
    "email": "이메일",
    "username": "닉네임",
    "password": "비밀번호",
    "age": "나이",
    "job_field": "분야",
    "job": "직무",
    "position": "직책",
    "gender": "성별",
    "credit": "크레딧",
    "card": "명함 이미지",
    "id": "고유번호",
    "name": "이름",
    "phoneNumber": "연락처",
    "content": "내용",
    "pdf": "PDF",
    "pdf_id": "PDF 고유번호",
}