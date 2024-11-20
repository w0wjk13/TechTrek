import { Study, StudyUsers } from "/imports/api/collections";
import "/lib/utils.js";

const regions = [
  "서울",
  "경기",
  "인천",
  "대구",
  "대전",
  "세종",
  "경남",
  "전남",
  "충남",
  "제주",
  "부산",
  "광주",
  "울산",
  "강원",
  "경북",
  "전북",
  "충북",
];

const districts = [
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
];

const randomAddress = () => {
  const region = regions.random();

  if (region === "서울") {
    const district = districts.random();
    return { address: `서울 ${district}` };
  } else {
    return { address: region };
  }
};

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
        position: ["백엔드", "프론트엔드", "풀스택"].random(1),
        avgScore: {
          manner: [1, 2, 3, 4, 5].random(), //매너(친절)
          mentoring: [1, 2, 3, 4, 5].random(), //다른 사람 도와주기(지식 공유)
          passion: [1, 2, 3, 4, 5].random(), //열정(참여도)
          communication: [1, 2, 3, 4, 5].random(), //의사소통
          time: [1, 2, 3, 4, 5].random(), //시간준수
        },
      },
      createdAt: new Date(),
    });
  }
}
