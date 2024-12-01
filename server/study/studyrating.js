import { Meteor } from 'meteor/meteor';
import { Study, Application, Rating } from '/imports/api/collections';  // 'Rating' 컬렉션 사용

Meteor.methods({
  // 스터디 신청자 목록을 가져오는 메서드
  'study.getApplications'(studyId) {
    if (typeof studyId !== 'string') {
      throw new Meteor.Error('invalid-study-id', '스터디 ID는 문자열이어야 합니다.');
    }

    const study = Study.findOne({ _id: studyId });
    if (!study) {
      throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
    }

    const applications = Application.find({ studyId }).fetch();
    return applications;
  },

  // 특정 사용자가 수락된 신청자만 필터링하는 메서드
  'study.getAcceptedParticipantsFromApplication'(studyId) {
    if (typeof studyId !== 'string') {
      throw new Meteor.Error('invalid-study-id', '스터디 ID는 문자열이어야 합니다.');
    }

    const study = Study.findOne({ _id: studyId });
    if (!study) {
      throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
    }

    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = Meteor.user();
    const currentUserNickname = currentUser ? currentUser.profile?.nickname : null;
   
    // 신청자 목록 가져오기
    const applications = Application.find({ studyId }).fetch();

    // 신청자 목록에서 수락된 신청자만 필터링 (현재 사용자 제외)
    const filteredApplications = applications.map(app => {
      const filteredApplicants = (app.userIds || []).map((userId, index) => {
        const applicantState = (app.states || [])[index];  // 해당 신청자의 상태
        return {
          userId,
          state: applicantState,
          nickname: (app.nicknames || [])[index]  // 신청자의 닉네임
        };
      }).filter(applicant => 
        applicant.state === '수락' && applicant.userId !== currentUserNickname // 현재 사용자를 제외한 수락된 신청자만 필터링
      );  

      return {
        ...app,
        applicants: filteredApplicants
      };
    });

    return filteredApplications;
  },

  // 평가 데이터를 저장하고 평균 평점을 계산하는 메서드
  'study.submitRating'(data) {
    const { studyId, userId, rating, comment } = data;

    if (!studyId || !userId) {
      throw new Meteor.Error('invalid-data', '스터디 ID와 사용자 ID는 필수입니다.');
    }

    // 평점 데이터 처리
    const existingRating = Rating.findOne({ studyId, userId });

    if (existingRating) {
      // 기존 평가가 있으면 업데이트
      Rating.update(
        { _id: existingRating._id },
        {
          $set: { rating, comment, updatedAt: new Date() },
        }
      );
    } else {
      // 처음 평가하는 경우
      Rating.insert({
        studyId,
        userId,
        rating,  // 평점
        comment,
        createdAt: new Date(),
      });
    }

    // 해당 사용자의 평균 평점 계산
    const ratingsData = Rating.find({ studyId, userId }).fetch();
    const totalRatings = ratingsData.reduce((sum, data) => sum + data.rating, 0); // 평점의 합
    const totalRatingCount = ratingsData.length; // 평점의 개수
    
    const averageRating = totalRatingCount > 0 ? totalRatings / totalRatingCount : 0;

    // 평균 평점 업데이트
    Rating.update(
      { studyId, userId },
      {
        $set: { averageRating },
      }
    );

    return '평가 제출 성공';
  },
});
