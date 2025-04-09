FROM python:alpine AS base

FROM base AS deps

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "fastapi", "dev", "main.py" ]