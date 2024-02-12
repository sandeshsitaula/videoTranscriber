FROM python:3.11

WORKDIR /app

COPY demo/ .

RUN pip install openai-whisper
CMD ["/bin/bash"]
