import { Meteor } from 'meteor/meteor';
import { Study, Application, Rating } from '/imports/api/collections';  // 'Rating' 컬렉션 사용

Meteor.methods({
  'study.getApplications'(studyId) {
    if (typeof studyId !== 'string') {
      throw new Meteor.Error('invalid-study-id', '스터디 ID는 문자열이어야 합니다.');
    }

    const study = Study.findOne({ _id: studyId });
    if (!study) {
      throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
    }

     const currentUser = Meteor.user();
    const currentUserNickname = currentUser ? currentUser.profile?.nickname : null;
    if (!currentUserNickname) {
      throw new Meteor.Error('not-logged-in', '로그인된 사용자만 접근할 수 있습니다.');
    }

    // 해당 사용자가 이미 평가한 상태인지 확인
    const existingRating = Rating.findOne({ studyId, ratedUserId: currentUserNickname });
    if (existingRating) {
      throw new Meteor.Error('already-rated', '이미 평가한 사용자입니다. 평가 페이지에 접근할 수 없습니다.');
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

  // 스터디 신청자 목록을 가져오는 메서드
'study.submitRating'(data) {
    // 데이터 유효성 검사 (check 대신 사용)
    if (typeof data !== 'object' || data === null) {
      throw new Meteor.Error('invalid-data', '잘못된 데이터 형식입니다.');
    }

    const { studyId, ratedUserId, rating, recommendation, feedback } = data;

    // 필수 데이터가 존재하는지 확인
    if (typeof studyId !== 'string') {
      throw new Meteor.Error('invalid-study-id', '스터디 ID는 문자열이어야 합니다.');
    }
    if (typeof ratedUserId !== 'string') {
      throw new Meteor.Error('invalid-rated-user-id', '평가받는 사용자 ID는 문자열이어야 합니다.');
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new Meteor.Error('invalid-rating', '평점은 1에서 5 사이의 숫자여야 합니다.');
    }

    // 추천 항목 확인
    if (typeof feedback !== 'string') {
      feedback = '';  // 피드백이 문자열이 아닌 경우 빈 문자열로 설정
    }

    const validRecommendationValues = [1, 0];  // 0을 허용하려면 이와 같이 추가
    Object.values(recommendation).forEach(value => {
      if (!validRecommendationValues.includes(value)) {
        throw new Meteor.Error('invalid-recommendation-value', '추천 항목의 값은 1 또는 0이어야 합니다.');
      }
    });

    // 평가한 사람은 현재 로그인한 유저
    const currentUser = Meteor.user();
    const userId = currentUser ? currentUser._id : null;
    const userNickname = currentUser ? currentUser.profile?.nickname : null;  // 닉네임 추가
    if (!userId) {
      throw new Meteor.Error('not-logged-in', '로그인된 사용자만 평가할 수 있습니다.');
    }

    // Rating 컬렉션에 평가 정보 저장
    Rating.insert({
      studyId,
      ratedUserId,  // 평가 받는 사람 ID
      userId: userNickname,  // 평가한 사람 ID
      rating,  // 평점
      recommendation,  // 선택된 항목
      feedback,
      createdAt: new Date(),
    });

    // 해당 사용자가 받은 평가 데이터 가져오기
    const ratingsData = Rating.find({ ratedUserId }).fetch();
    const totalRatings = ratingsData.reduce((sum, data) => sum + data.rating, 0);  // 평점의 합 계산
    const totalRatingCount = ratingsData.length;  // 평점 개수

    // 새로운 평균 평점 계산 (새로운 평점 총합 / 새로운 평점 개수)
    const newTotalRatings = totalRatings;
    const newTotalRatingCount = totalRatingCount;
    const newAverageRating = newTotalRatingCount > 0 ? parseFloat((newTotalRatings / newTotalRatingCount).toFixed(1)) : 0.0;

    // 추천 항목 계산 (각 항목별 1의 갯수)
    const recommendationCounts = {
      participation: 0,
      teamwork: 0,
      leadership: 0,
      communication: 0,
      timeliness: 0
    };

    ratingsData.forEach(rating => {
      for (let key in recommendationCounts) {
        if (rating.recommendation[key] === 1) {
          recommendationCounts[key]++;
        }
      }
    });

    // 사용자 프로필 업데이트
    Meteor.users.update(
      { 'profile.nickname': ratedUserId },  // 평가받는 사람을 식별
      {
        $set: {
          'profile.rating': newAverageRating,  // 소수점 첫째 자리까지 반올림한 평균 평점 업데이트
          'profile.recommendation': recommendationCounts,  // 추천 항목 업데이트
        }
      }
    );

    return '평가 제출 성공';
  },

}); 