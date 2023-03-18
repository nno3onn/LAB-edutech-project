# LAB-edutech-project
학습 도우미 교육 웹 애플리케이션

<br>

![image](https://user-images.githubusercontent.com/60952506/226072504-7265d9f4-8737-41ac-9e05-b538397ec562.png)

<br>

## 📅 진행 기간
2021.06.01 ~ 2021.08.31

<br>
<br>

## ⚒️ 사용 기술
- HTML, CSS, JavaScript, jQuery, Ajax
- Node.js, Express, Socket.io
- AWS EC2, SSL
- SQlite3
- Bootstrap, Reveal.ljs, Chart.js
- Google Dialogflow(Intents, Entities, Fulfillment), Google Sheets, Google TTS(Text-To-Speech)
- Firebase Authentication, Firebase Cloud Functions

<br>
<br>

## 💻 담당 기능
- **SSL 인증서**를 받고 **https 서버 구축** 및 도메인 등록
- Firebase Authentication을 활용하여 회원가입 및 **소셜 로그인**(facebook, google) 구현
- google sheets에 있는 단어 리스트를 읽고 **Google Text-to-Speech**를 활용하여 mp3로 변환 후 mp3를 로컬 서버에 저장
- **Dialogflow Intents**와 **Entities**를 활용하여 챗봇 제작 (사용자의 채팅(ex. 공부 시작, 퀴즈 시작, 그만할래 등)에 따른 알맞은 행동 취하기)
- **Dialogflow Fulfillment**를 활용하여 사용자가 답한 퀴즈의 정답 유무를 판별하고, 정답유무 데이터를 SQlite3에 저장
- DB를 읽고 마이 페이지에서 사용자 정보를 보여주고, **Chart.js**를 활용하여 학습 차트 보여주기

<br>
<br>

## 💭 알게된 점
- https 서버를 구현하려면 **SSL 인증서**가 필요함
- Dialogflow fulfillment(webhook)를 이용하려면 https 서버로만 접근이 가능함
- 카카오톡, 슬랙 등 사용 사례들과 공부를 하여 **webhook**의 개념을 알게됨
- SQlite3를 통해 **SQL**문을 처음 작성해보고 SQL의 특징을 알게됨

<br>
<br>

## 📖 상세 내용

교내 SoC 연구실 학부연수생으로서 진행한 프로젝트입니다.
Reveal.js를 활용하여 학습할 내용이 슬라이드로 넘어갈 수 있도록 하였습니다.

![image](https://user-images.githubusercontent.com/60952506/226072592-3aeab3d3-2c33-45ce-9cf5-318c5953f361.png)

🔹 웹 화면
![image](https://user-images.githubusercontent.com/60952506/226072629-caa85dc6-6d4f-4db7-b322-d851f97e15a5.png)

<img src="https://user-images.githubusercontent.com/60952506/226072642-5214cfaf-e4a1-47aa-84bf-9a931606e668.png" width="600" />

![image](https://user-images.githubusercontent.com/60952506/226072659-629b7f63-9559-46ed-85b0-f5c849c3e038.png)

![image](https://user-images.githubusercontent.com/60952506/226072672-67120737-a1fb-4d10-b463-047d3af4db12.png)

