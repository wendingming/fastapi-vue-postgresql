from fastapi import FastAPI,Form                 #步骤 1：导入 FastAPI
# A、导入对应的包
from fastapi.middleware.cors import CORSMiddleware
from login import login_for_access_token, FormData

app = FastAPI()                             #步骤 2：创建一个 FastAPI「实例」，使用【uvicorn main:app --reload】启动，其中的【app】就是这里指定的实例

# B、声明一个 源 列表；重点：要包含跨域的客户端 源
origins = [
    "*"
]

# C、配置 CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允许访问的源
    allow_credentials=True,  # 支持 cookie
    allow_methods=["*"],  # 允许使用的请求方法
    allow_headers=["*"]  # 允许携带的 Headers
)

# 步骤 3：创建一个路径操作，操作：指http方法：包括【POST,GET,PUT,DELETE,OPTIONS,HEAD,PATCH,TRACE】
# 定义一个路径操作装饰器：
# @app.get("/") 告诉 FastAPI 在它下方的函数负责处理如下访问请求：
# 请求路径为 /
# 使用 get 操作

# 步骤 4：定义路径操作函数
# 这是我们的「路径操作函数」：
# 路径：是 /。
# 操作：是 get。
# 函数：是位于「装饰器」下方的函数（位于 @app.get("/") 下方）。
# async 指的是异步模式，当然也可以使用常规模式【去掉async就可以了】，

# 步骤 5：返回内容
# return 你可以返回一个 dict、list，像 str、int 一样的单个值，等等。
@app.get("/")
async def root():
    return {"message": "Hello World"}

#新增接口login
@app.post("/login")
async def login_back_token(*, username: str = Form(...), password: str = Form(...)):#因为要接收前端传递的表单，所以把接收form_data:FormData类改成接收Form表单对象，
    form_data = FormData(uname=username,passwd=password)
    # 调用login.py的login_for_access_token方法
    token = login_for_access_token(form_data)
    return token