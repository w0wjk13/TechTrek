import { Meteor } from 'meteor/meteor';
import { Study, Application } from '/imports/api/collections'; // Study와 Application 컬렉션 불러오기

Meteor.methods({
  // 스터디 신청자 목록을 가져오는 메서드
  'study.getApplications'(studyId) {
    // 스터디 ID가 유효한지 확인
    if (typeof studyId !== 'string') {
      throw new Meteor.Error('invalid-study-id', '스터디 ID는 문자열이어야 합니다.');
    }

    // Study 컬렉션에서 해당 studyId를 가진 스터디를 찾음
    const study = Study.findOne({ _id: studyId });
    if (!study) {
      throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
    }

    // 스터디 신청서(Application) 데이터 가져오기
    const applications = Application.find({ studyId }).fetch();

    // 신청서 데이터 반환
    return applications;
  },

  // 특정 사용자가 수락된 신청자만 필터링하는 메서드
  'study.getAcceptedParticipantsFromApplication'(studyId) {
    // 스터디 ID가 유효한지 확인
    if (typeof studyId !== 'string') {
      throw new Meteor.Error('invalid-study-id', '스터디 ID는 문자열이어야 합니다.');
    }

    // Study 컬렉션에서 해당 studyId를 가진 스터디를 찾음
    const study = Study.findOne({ _id: studyId });
    if (!study) {
      throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
    }
    // 현재 로그인한 사용자의 정보 가져오기
    const currentUser = Meteor.user();
    const currentUserNickname = currentUser ? currentUser.profile?.nickname : null;
    // Application 컬렉션에서 해당 studyId와 수락 상태인 신청자만 필터링
    const applications = Application.find({
      studyId,
      states: { $in: ['수락'] },  // '수락' 상태인 신청자만 가져옴
    }).fetch();

    // 각 신청서에서 수락된 신청자만 반환
    const acceptedParticipants = applications.map((app) => {
      // 각 신청서에서 수락된 신청자만 필터링
      const acceptedApplicants = app.userIds
        .map((userId, index) => {
          const applicantState = app.states[index]; // 해당 신청자의 상태
          return {
            userId,
            state: applicantState,
            nickname: app.nicknames[index], // 신청자의 닉네임
          };
        })
        .filter((applicant) => applicant.state === '수락'&& applicant.userId !== currentUserNickname); // '수락' 상태인 사람만 필터링

      return {
        ...app,
        applicants: acceptedApplicants,
      };
    });

    return acceptedParticipants;
  },


});
