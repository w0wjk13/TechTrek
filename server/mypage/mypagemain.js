import { Meteor } from 'meteor/meteor';
import { Study, Application } from '/imports/api/collections';

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { profile: 1, email: 1, createdAt: 1 } });
  }
  return this.ready(); // 로그인하지 않으면 빈 데이터 반환
});

Meteor.methods({
  // 종료된 스터디 목록 가져오기
  'study.getCompletedStudies': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    const user = Meteor.users.findOne(this.userId);
    if (!user || !user.profile || !user.profile.nickname) {
      throw new Meteor.Error('no-nickname', '사용자 닉네임이 없습니다.');
    }

    const nickname = user.profile.nickname;

    // 종료된 스터디 찾기 (Application 컬렉션에서)
    const completedApplications = Application.find({
      userIds: nickname,
      progress: '종료',
    }).fetch();

    if (completedApplications.length === 0) {
      return []; // 종료된 스터디가 없다면 빈 배열 반환
    }

    // 스터디 아이디 목록을 가져오기
    const studyIds = completedApplications.map(application => application.studyId);

    // Study 컬렉션에서 해당 스터디 정보 가져오기
    const completedStudies = Study.find({
      _id: { $in: studyIds }
    }).fetch();

    // 각 스터디에 대해 Application에서 startDate, endDate를 가져와 함께 반환
    const studiesWithDates = completedStudies.map(study => {
      const application = completedApplications.find(app => app.studyId === study._id);
      return {
        ...study,
        startDate: application ? application.startDate : null,  // Application에서 startDate 가져오기
        endDate: application ? application.endDate : null,      // Application에서 endDate 가져오기
      };
    });

    return studiesWithDates;
  },
});

Meteor.startup(() => {
  // 서버에서 필요한 초기화 작업을 진행
});
