import { Study, Application ,Rating} from "/imports/api/collections";
import Data from "../imports/ui/Data.jsx";

const noimage = '/noimage.png';
const { citys, techStacks } = Data;

// citys 배열에서 랜덤으로 도시와 구를 선택하여 주소를 생성하는 함수
const randomAddress = () => {
  const city = citys[Math.floor(Math.random() * citys.length)];
  const gubun = city.gubuns[Math.floor(Math.random() * city.gubuns.length)];
  return {
    city: city.name,
    gubun: gubun,
  };
};

// 핸드폰 중간, 뒷번호 4자리 만들기
const randomNumber = () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
};

const recommendation = {
  participation: Math.floor(Math.random() * 30) + 1,
  teamwork: Math.floor(Math.random() * 30) + 1,
  leadership: Math.floor(Math.random() * 30) + 1,
  communication: Math.floor(Math.random() * 30) + 1,
  timeliness: Math.floor(Math.random() * 30) + 1,
};

if (Study.find().count() === 0 && Application.find().count() === 0) {
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

// admin 외에 다른 사용자가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  for (let i = 1; i <= 50; i++) {
    Accounts.createUser({
      password: "1234",
      email: `user${i}@example.com`,
      profile: {
        name: "user" + i,
        nickname: `nickname${i}`,
        phone: `010-${randomNumber()}-${randomNumber()}`,
        profilePicture: noimage,
        address: randomAddress(),
        techStack: techStacks.sort(() => Math.random() - 0.5).slice(0, 5),  // 랜덤으로 기술 스택 선택
        roles: ["백엔드", "프론트엔드", "풀스택"].sort(() => Math.random() - 0.5).slice(0, 1),  // 랜덤으로 역할 선택
        rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
        recommendation: recommendation,
      },
      createdAt: new Date(),
    });
  }
}

// 스터디 모집글이 없다면 (20개 생성)
if (Study.find().count() === 0) {
  for (let i = 0; i < 30; i++) {  // 20개 스터디 모집글 생성
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
    const user = users[Math.floor(Math.random() * users.length)];  // 랜덤 사용자 선택

    // 해당 유저가 이미 스터디를 작성한 적이 있는지 확인
    const existingStudy = Study.findOne({ userId: user.profile.nickname });

    // 유저가 스터디를 작성하지 않은 경우에만 스터디를 생성
    if (!existingStudy) {
    // 현재 날짜에 1~30일 사이의 랜덤 값을 더해주어 한 달 내의 날짜를 설정
    const randomDays = Math.floor(Math.random() * 30) + 1;
    const studyClose = new Date();
    studyClose.setDate(studyClose.getDate() + randomDays);

    // 스터디 모집글 삽입
    const studyId = Study.insert({
      userId: user.profile.nickname,
      roles: ["풀스택", "백엔드", "프론트엔드"].sort(() => Math.random() - 0.5).slice(0, 1),
      onOffline: ["온라인", "오프라인", "온/오프라인"].sort(() => Math.random() - 0.5).slice(0, 1),
      address: randomAddress(),
      studyCount: Math.floor(Math.random() * 9) + 2,  // 모집인원 (1~10명)
      techStack: techStacks.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 1),
      studyClose: studyClose,
      rating: (Math.random() * 4 + 1).toFixed(1),
      title: "제목" + (i + 1),
      content: "내용" + (i + 1),
      createdAt: new Date(),
      views: i,
      status: "모집중",
   
    });

    // 스터디 모집글 작성자가 자동으로 해당 스터디에 신청
    const existingApplication = Application.findOne({ studyId, userIds: { $in: [user.profile.nickname] } });
    if (!existingApplication) {
      Application.insert({
        studyId: studyId,
        userIds: [user.profile.nickname],  // 신청자 배열 초기화
        states: ['수락'],  // 신청 상태 배열 초기화
        progress: '예정' ,
        createdAt: new Date(),
        startDate: '미정',
        endDate: '미정',
      });
    }
  }
}
}

// 모든 스터디 ID 가져오기
const studyIds = Study.find().fetch().map(study => study._id); 

// 랜덤으로 스터디 모집글 15개 선택
const randomStudyIds = studyIds
  .sort(() => Math.random() - 0.5)  // 배열을 랜덤하게 섞음
  .slice(0, 15);  // 상위 15개 선택

// 각 스터디 모집글에 대해 랜덤으로 참가자 추가
randomStudyIds.forEach((studyId) => {
  const study = Study.findOne(studyId);

  // 스터디 모집인원 수가 초과되지 않도록 하기 위한 인원 제한
  const maxApplicants = study.studyCount;
  const numOfApplicants = Math.min(Math.floor(Math.random() * 4) + 2, maxApplicants);  // 1~5명 랜덤 또는 모집인원 이하
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
  const applicants = [];

  // 랜덤 신청자 선택
  for (let i = 0; i < numOfApplicants; i++) {
    const applicant = users[Math.floor(Math.random() * users.length)];

    // 이미 신청한 사용자가 중복으로 신청하지 않도록 하기 위해 Application 컬렉션을 확인
    const existingApplication = Application.findOne({
      studyId: studyId,
      userIds: applicant.profile.nickname,  // 해당 사용자가 이미 신청한 경우
    });

    if (!existingApplication) {  // 중복 신청자가 없으면
      

      // Application 컬렉션에 신청 정보 추가
      Application.update(
        { studyId: studyId },
        {
          $push: { userIds: applicant.profile.nickname, states: '신청' },  // 신청자 추가
         
        }
      );
    }
  }

  // 모집중 상태인 스터디에서 5개만 모집완료로 변경
const studiesToUpdate = Study.find({ status: '모집중' }).fetch().slice(0, 5);  // 모집중인 스터디 중 5개 선택

studiesToUpdate.forEach(study => {
  // 해당 스터디에 신청한 유저들 찾기
  const applications = Application.find({ studyId: study._id, states: '신청' }).fetch();

  if (applications.length > 0) {
    // 신청한 유저들의 'states'를 '수락'으로 변경
    applications.forEach(application => {
      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() + 3));  // 현재 날짜 기준으로 3일 후
      const endDate = new Date(startDate);  // startDate로부터 7일 후 종료일 설정
      endDate.setDate(startDate.getDate() + 7);
      Application.update(
        { _id: application._id },
        { $set: { states: application.states.map(state => state === '신청' ? '수락' : state), 
          progress: '종료' ,startDate: startDate,endDate: endDate} }
      );
    });
    Study.update(
      { _id: study._id },
      { $set: { status: '모집완료' } }
    );
  
    const completedStudies = Application.find({ progress: '종료' }).fetch();
    completedStudies.forEach(study => {
      const studyId = study.studyId; // study._id -> studyId로 설정
      // 해당 스터디의 수락된 신청자들 가져오기
      const applicants = Application.find({ studyId: studyId, states: '수락' }).fetch();
   
      // 나를 제외한 다른 신청자들을 평가
      applicants.forEach(application => {
        const applicants = application.userIds;  // 해당 스터디에 신청한 모든 사용자
        const studyId = application.studyId;  // 스터디 ID

        // 신청자들끼리 서로 평가하도록 하기 위해 각 신청자끼리 평가를 진행
        applicants.forEach(userNickname => {
          applicants.forEach(ratedUserId => {
          if (userNickname !== ratedUserId) {
          const existingRating = Rating.findOne({
            studyId: studyId,
            userId: userNickname,  // 평가한 사람
            ratedUserId: ratedUserId  // 평가받은 사람
          });

          if (!existingRating) {
            // 평점, 추천 항목, 피드백 등을 랜덤으로 생성
            const rating = Math.floor(Math.random() * 5) + 1;  // 평점 1~5
            const recommendation = {
              participation: Math.random() < 0.5 ? 1 : 0,
              teamwork: Math.random() < 0.5 ? 1 : 0,
              leadership: Math.random() < 0.5 ? 1 : 0,
              communication: Math.random() < 0.5 ? 1 : 0,
              timeliness: Math.random() < 0.5 ? 1 : 0,
            };
            const feedback = "잘 했어요! 앞으로도 함께 공부하고 싶어요."; // 더미 피드백
   
            // Rating.insert()로 평가 추가
            Rating.insert({
              studyId: studyId,  // 해당 스터디 ID
              ratedUserId: ratedUserId,  // 평가 받는 사람 ID
              userId: userNickname,  // 평가한 사람 ID
              rating: rating,  // 평점
              recommendation: recommendation,  // 추천 항목
              feedback: feedback,  // 피드백
              createdAt: new Date(),
            });
          }
        }
      })
        });
      });
    });
   


  }
});

  
});

}