from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Resource not found"
            }
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error"
            }
        )