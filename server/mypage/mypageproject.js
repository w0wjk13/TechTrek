import { Meteor } from 'meteor/meteor';
import { Study, Application,Rating } from '/imports/api/collections';

Meteor.methods({
  // Get studies created by the logged-in user
  'study.getMyStudies': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

   // 로그인한 사용자의 nickname을 사용하여 userId를 찾기
   const user = Meteor.users.findOne(this.userId); // 현재 로그인한 사용자
   if (!user || !user.profile || !user.profile.nickname) {
     throw new Meteor.Error('no-nickname', '사용자 닉네임이 없습니다.');
   }

   const nickname = user.profile.nickname;

   // nickname을 기준으로 해당 사용자가 생성한 스터디를 찾기
   const myStudies = Study.find({ userId: nickname }).fetch();

   if (myStudies.length === 0) {
     throw new Meteor.Error('no-studies', '생성한 스터디가 없습니다.');
   }

   // 작성자 닉네임과 신청자 수를 포함한 스터디 목록 반환
   const studiesWithCreator = myStudies.map(study => {
     // 작성자 닉네임 설정
     const creator = Meteor.users.findOne({ 'profile.nickname': study.userId }); // nickname 기준으로 사용자 찾기
     study.creatorName = creator ? creator.profile.nickname : '알 수 없음'; // 작성자 닉네임 설정

     
     // 신청자 수 계산 (작성자 제외)
     const applications = Application.find({ studyId: study._id }).fetch();
     const applicants = applications.map(app => app.userIds).flat(); 
     study.applicants = applicants.filter(applicant => applicant !== study.userId);
     const applicantCount = applications.reduce((count, app) => {
      if (Array.isArray(app.userIds)) {
        const isApplicant = app.userIds.filter(userId => userId !== study.userId).length;
        return count + isApplicant;
      }
      return count; // userIds가 배열이 아닌 경우 count를 그대로 반환
    }, 0);
    
     study.applicantCount = applicantCount;

     // 스터디의 진행 상태(progress) 가져오기
     const application = Application.findOne({ studyId: study._id });
     study.progress = application ? application.progress : '예정'; // 신청서가 없으면 기본값 '예정'
     study.startDate = application ? application.startDate : new Date();
     study.endDate = application ? application.endDate : new Date();
     return study;
   });

   return studiesWithCreator; 
  },
'study.getRatedStudies'(userId) {
    if (!userId) {
      throw new Meteor.Error('User not found');
    }
    // Rating 컬렉션을 사용하여 해당 유저가 평가한 스터디 목록을 가져옴
    const ratedStudies = Rating.find({ userId }).fetch();

  // Extract the studyId from each rating and return it
  return ratedStudies.map(rating => String(rating.studyId));
  },
  // Get studies the current user has applied for
  'study.getAppliedStudies': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    const user = Meteor.users.findOne(this.userId); // 현재 로그인한 사용자 정보 가져오기
    if (!user || !user.profile || !user.profile.nickname) {
      throw new Meteor.Error('no-nickname', '사용자 닉네임이 없습니다.');
    }

    // 사용자 닉네임
    const nickname = user.profile.nickname;

    // 해당 사용자가 신청한 스터디 찾기
    const appliedStudies = Application.find({ userIds: nickname }).fetch();
    if (appliedStudies.length === 0) {
      return [];
    }

    const studyIds = appliedStudies.map(app => app.studyId);
    const studies = Study.find({ _id: { $in: studyIds } }).fetch();

    const studiesWithCreator = studies.map(study => {
      const creator = Meteor.users.findOne({ 'profile.nickname': study.userId }); // study.userId를 nickname으로 사용
      study.creatorName = creator ? creator.profile.nickname : '알 수 없음';

      const applications = Application.find({ studyId: study._id }).fetch();
      const applicants = applications.map(app => app.userIds).flat(); 
     study.applicants = applicants.filter(applicant => applicant !== study.userId);
      const applicantCount = applications.reduce((count, app) => {
        if (app.userIds && Array.isArray(app.userIds)) {
          const isApplicant = app.userIds.filter(userId => userId !== study.userId).length;
          return count + isApplicant;
        }
        return count;
      }, 0);
    study.applicantCount = applicantCount;

      const application = applications.find(app => app.userIds.includes(nickname));
      study.progress = application ? application.progress : '예정';
      study.startDate = application ? application.startDate : new Date();
      study.endDate = application ? application.endDate : new Date(); 
      return study;
    });

    return studiesWithCreator;
  },
});
Meteor.methods({
  'study.delete'(studyId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    const study = Study.findOne(studyId);
    if (!study) {
      console.error('Study not found:', studyId); // 로그 추가
      throw new Meteor.Error('study-not-found', '스터디를 찾을 수 없습니다.');
    }

    // 로그인한 사용자의 닉네임을 가져옴
    const user = Meteor.users.findOne(this.userId);
    const loggedInUserNickname = user ? user.profile.nickname : null;

    if (!loggedInUserNickname) {
      throw new Meteor.Error('nickname-not-found', '로그인한 사용자의 닉네임을 찾을 수 없습니다.');
    }

    // 스터디의 userId가 로그인한 사용자의 닉네임과 일치하는지 확인
    if (study.userId !== loggedInUserNickname) {
      console.error('Unauthorized attempt to delete study by user:', this.userId); // 로그 추가
      throw new Meteor.Error('not-authorized', '이 스터디를 삭제할 권한이 없습니다.');
    }

    // 스터디 삭제
    try {
      Study.remove(studyId);
      console.log('Study deleted successfully:', studyId); // 로그 추가
    } catch (error) {
      console.error('Error during study deletion:', error); // 로그 추가
      throw new Meteor.Error('delete-failed', '스터디 삭제 중 오류가 발생했습니다.');
    }
  },

  'study.cancelApplication'(studyId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    // 로그인한 사용자의 닉네임을 가져옴
  const user = Meteor.users.findOne(this.userId);
  const loggedInUserNickname = user ? user.profile.nickname : null;

  if (!loggedInUserNickname) {
    throw new Meteor.Error('nickname-not-found', '로그인한 사용자의 닉네임을 찾을 수 없습니다.');
  }

    const study = Study.findOne(studyId);
    if (!study) {
      throw new Meteor.Error('study-not-found', '스터디를 찾을 수 없습니다.');
    }

    // 신청 취소 처리
    const application = Application.findOne({ studyId, userIds: loggedInUserNickname });
    if (!application) {
      throw new Meteor.Error('no-application', '이 스터디에 신청하지 않았습니다.');
    }

    // 신청 취소 (userIds 배열에서 해당 사용자를 제거)
    try {
      // 해당 사용자가 포함된 신청서를 찾아서 그들의 userIds 배열에서만 사용자를 제거
      const updatedApplication = Application.update(
        { _id: application._id }, 
        { $pull: { userIds: loggedInUserNickname } }  // userIds 배열에서 현재 사용자를 제거
      );

      if (updatedApplication) {
        console.log('User application cancelled successfully:', studyId); // 로그 추가
      } else {
        console.error('Failed to cancel application for user:', this.userId, 'studyId:', studyId); // 로그 추가
        throw new Meteor.Error('cancel-failed', '스터디 신청 취소 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during application cancellation:', error); // 로그 추가
      throw new Meteor.Error('cancel-failed', '스터디 신청 취소 중 오류가 발생했습니다.');
    }
  }
});