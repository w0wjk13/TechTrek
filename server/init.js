import { Study } from "/imports/api/collections";
import { StudyUser } from "/imports/api/collections";
import "/lib/utils.js";

//시/도 목록
const regionData = {
  서울: [
    "강남구",
    "강동구",
    "강서구",
    "강북구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  부산: [
    "중구",
    "서구",
    "동구",
    "영도구",
    "부산진구",
    "동래구",
    "남구",
    "북구",
    "해운대구",
    "사하구",
    "금정구",
    "강서구",
    "연제구",
    "수영구",
    "사상구",
    "기장군",
  ],
  대구: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  인천: [
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
    "강화군",
    "옹진군",
  ],
  광주: ["동구", "서구", "남구", "북구", "광산구"],
  대전: ["동구", "중구", "서구", "유성구", "대덕구"],
  울산: ["중구", "남구", "동구", "북구", "울주군"],
  세종: [],
  경기: [
    "수원시",
    "고양시",
    "용인시",
    "성남시",
    "부천시",
    "안산시",
    "안양시",
    "남양주시",
    "화성시",
    "평택시",
    "의정부시",
    "파주시",
    "시흥시",
    "김포시",
    "광명시",
    "광주시",
    "군포시",
    "하남시",
    "오산시",
    "이천시",
    "안성시",
    "의왕시",
    "양주시",
    "구리시",
    "포천시",
    "여주시",
    "양평군",
    "동두천시",
    "가평군",
    "연천군",
  ],
  강원: [
    "춘천시",
    "원주시",
    "강릉시",
    "동해시",
    "태백시",
    "속초시",
    "삼척시",
    "홍천군",
    "횡성군",
    "영월군",
    "평창군",
    "정선군",
    "철원군",
    "화천군",
    "양구군",
    "인제군",
    "고성군",
    "양양군",
  ],
  충북: [
    "청주시",
    "충주시",
    "제천시",
    "보은군",
    "옥천군",
    "영동군",
    "증평군",
    "진천군",
    "괴산군",
    "음성군",
    "단양군",
  ],
  충남: [
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
    "금산군",
    "부여군",
    "서천군",
    "청양군",
    "홍성군",
    "예산군",
    "태안군",
  ],
  전북: [
    "전주시",
    "군산시",
    "익산시",
    "정읍시",
    "남원시",
    "김제시",
    "완주군",
    "진안군",
    "무주군",
    "장수군",
    "임실군",
    "순창군",
    "고창군",
    "부안군",
  ],
  전남: [
    "목포시",
    "여수시",
    "순천시",
    "나주시",
    "광양시",
    "담양군",
    "곡성군",
    "구례군",
    "고흥군",
    "보성군",
    "화순군",
    "장흥군",
    "강진군",
    "해남군",
    "영암군",
    "무안군",
    "함평군",
    "영광군",
    "장성군",
    "완도군",
    "진도군",
    "신안군",
  ],
  경북: [
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
    "의성군",
    "청송군",
    "영양군",
    "영덕군",
    "청도군",
    "고령군",
    "성주군",
    "칠곡군",
    "예천군",
    "봉화군",
    "울진군",
    "울릉군",
  ],
  경남: [
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
    "의령군",
    "함안군",
    "창녕군",
    "고성군",
    "남해군",
    "하동군",
    "산청군",
    "함양군",
    "거창군",
    "합천군",
  ],
  제주: ["제주시", "서귀포시"],
};

//유저(주소) 스터디모집(지역) 만들기
const randomAddress = () => {
  //시/도 랜덤 선택
  const regions = Object.keys(regionData); //시/도 목록을 배열로 반환
  const city = regions.random();

  //구/군 랜덤 선택
  const gubunList = regionData[city];
  const gubun = gubunList.random();

  return { city: city, gubun: gubun };
};

//기술스택 목록
const techStacks = [
  "Java",
  "NodeJS",
  "Kotlin",
  "Mysql",
  "MongoDB",
  "Python",
  "Oracle",
  "AWS",
  "Spring",
  "Azure",
  "NextJS",
  "Kubernetes",
  "Javascript",
  "Flutter",
  "Docker",
  "Typescript",
  "Swift",
  "Django",
  "React",
  "ReactNative",
];

//핸드폰 중간, 뒷번호 4자리 만들기
const randomNumber = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 9].random(4).join("");
};

//Study.remove({});
//StudyUser.remove({});

//admin 생성
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//admin 외에 다른 사용자가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  for (let i = 1; i <= 50; i++) {
    Accounts.createUser({
      password: "1234",
      email: `user${i}@example.com`,
      profile: {
        name: "user" + i,
        nickname: `nickname${i}`,
        phone: `010-${randomNumber()}-${randomNumber()}`,
        profilePicture: "https://example.com/profile.jpg",
        address: randomAddress(),
        techStack: techStacks.random(1, 5),
        roles: ["백엔드", "프론트엔드", "풀스택"].random(),
        score: {
          manner: [0, 1, 2, 3, 4, 5].random(), //매너(친절)
          mentoring: [0, 1, 2, 3, 4, 5].random(), //다른 사람 도와주기(지식 공유)
          passion: [0, 1, 2, 3, 4, 5].random(), //열정(참여도)
          communication: [0, 1, 2, 3, 4, 5].random(), //의사소통
          time: [0, 1, 2, 3, 4, 5].random(), //시간준수
        },
      },
      createdAt: new Date(),
    });
  }
}

//스터디 모집글이 없다면
if (!Study.findOne()) {
  for (let i = 0; i < 30; i++) {
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
    const user = users.random();

    //Study문서 생성일을 기준으로 랜덤으로 1주~4주 후를 모집마감일로 설정
    const randomWeeks = [7, 14, 21, 28].random();
    const studyClose = new Date();
    studyClose.setDate(studyClose.getDate() + randomWeeks);

    const scoreFields = [
      "manner",
      "mentoring",
      "passion",
      "communication",
      "time",
    ];

    //스터디모집글 작성자가 요구하는 역량
    const needScore = scoreFields.random(1, 5);

    //요구하는 역량에 랜덤으로 점수 할당
    const score = {};
    needScore.forEach((need) => {
      score[need] = [1, 2, 3, 4].random();
    });

    //글 작성자는 항상 첫번째 팀원이 됨
    const teamMember = [user._id];

    Study.insert({
      userId: user._id,
      roles: ["풀스택", "백엔드", "프론트엔드"].random(),
      onOffline: ["온라인", "오프라인", "온/오프라인"].random(),
      address: randomAddress(),
      studyCount: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].random(), //총 모집인원
      techStack: techStacks.random(1, 5),
      studyClose: studyClose,
      score: score,
      title: "제목" + i,
      content: "내용" + i,
      createdAt: new Date(),
      views: i,
      status: "모집중",
      teamMember: teamMember,
    });
  }
}

//스터디 신청자가 없다면
if (!StudyUser.findOne()) {
  for (let i = 0; i < 30; i++) {
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();

    //스터디가 요구하는 역량에 부합하는 사용자만 신청 가능하도록 설정
    Study.find()
      .fetch()
      .forEach((study) => {
        const studyScore = study.score;

        let okUser = 0; //각 스터디에 승인된 유저를 카운트하기 위한 변수
        users.forEach((user) => {
          const userScore = user.profile.score;

          //특정 스터디에 이미 지원한 유저가 중복 지원할 수 없도록 설정
          const isExist = StudyUser.findOne({
            studyId: study._id,
            userId: user._id,
          });

          if (isExist) {
            return;
          }

          //스터디에서 요구하는 역량/점수와 유저의 역량/점수 비교
          let canJoin = true;
          for (key in studyScore) {
            if (userScore[key] < studyScore[key]) {
              canJoin = false;
              break;
            }
          }

          //스터디에 신청 가능한 okUser의 수가 스터디 모집인원(studyCount)을 넘지 않았다면
          if (canJoin && okUser < study.studyCount - 1) {
            const status = ["대기중", "승인됨", "거절됨"].random();

            StudyUser.insert({
              studyId: study._id,
              userId: user._id,
              status: status,
            });

            //승인된 유저는 Study의 팀원(teamMember) 목록에 올라감
            if (status === "승인됨") {
              Study.update(
                { _id: study._id },
                { $addToSet: { teamMember: user._id } }
              );
              okUser++;
              console.log(
                `Study: ${study.title} - 승인유저: ${user.profile.name}`
              );
            }
          }
        });

        //팀원(teamMember) 수가 1이면 무조건 status는 모집중이지만 2 이상이면 시작, 마감, 모집중 중에 하나를 가짐
        const statusChange = Study.findOne(study._id);
        if (statusChange.teamMember.length >= 2) {
          Study.update(
            { _id: study._id },
            { $set: { status: ["모집중", "시작", "마감"].random() } }
          );
        }
      });
  }
}
