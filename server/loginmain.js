import { Accounts } from 'meteor/accounts-base';

const randomEmail = (index) => `user${index}@example.com`;

const randomPhone = () => {
  const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
  return `010-${randomDigits()}-${randomDigits()}`;
};

const randomTechStack = () => {
  const techStacks = [
    "Java", "NodeJS", "Kotlin", "Mysql", "MongoDB", "Python", "Oracle",
    "AWS", "Spring", "Azure", "NextJS", "Kubernetes", "Javascript",
    "Flutter", "Docker", "Typescript", "Swift", "Django", "React", "ReactNative"
  ];
  const stack1 = techStacks[Math.floor(Math.random() * techStacks.length)];
  let stack2;
  do {
    stack2 = techStacks[Math.floor(Math.random() * techStacks.length)];
  } while (stack1 === stack2);
  return [stack1, stack2];
};

const randomPosition = () => {
  const positions = ["백엔드", "프론트엔드", "풀스택"];
  return [positions[Math.floor(Math.random() * positions.length)]];
};

const randomAddress = () => {
  const districts = [
    "강남구", "강동구", "강서구", "강북구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구",
    "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구",
    "용산구", "은평구", "종로구", "중구", "중랑구"
  ];
  const district = districts[Math.floor(Math.random() * districts.length)];
  return {
    address: `서울 ${district}`,
  };
};

if (!Accounts.findUserByUsername("admin")) {
  Accounts.createUser({
    name: "admin",
    email: "admin@example.com",
    password: "1234",
    profile: {
      name: "admin",
    },
  });
  console.log("Admin account created: name: admin, password: 1234");
} else {
  console.log("Admin account already exists.");
}

for (let i = 1; i <= 100; i++) {
  const name = `user${i}`;
  Accounts.createUser({
    name: name,
    email: randomEmail(i),
    password: "1234",
    profile: {
      name: name,
      nickname: `nickname${i}`,
      phone: randomPhone(),
      profilePicture: "https://example.com/profile.jpg",
      address: randomAddress(),
      techStack: randomTechStack(),
      position: randomPosition(),
      avgScore: {
        manner: 3,           // 매너
        mentoring: 3,        // 재능기부
        passion: 3,          // 참여도
        communication: 3,    // 소통
        time: 3              // 시간 준수
      },
      createdAt: new Date(),
    }
  });
}
