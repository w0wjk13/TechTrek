import { Meteor } from 'meteor/meteor';
import { Rating, Study } from '/imports/api/collections';  // Rating 컬렉션

Meteor.methods({
    'study.getRatingsForUser'(userId) {
      if (typeof userId !== 'string') {
        throw new Meteor.Error('invalid-user-id', '사용자 ID는 문자열이어야 합니다.');
      }
  
      // 해당 유저가 받은 평가 목록 가져오기
    const ratings = Rating.find({ ratedUserId: userId }).fetch();

      // 각 평가에 대해 스터디 제목을 추가
    const ratingsWithStudyTitle = ratings.map(rating => {
      const study = Study.findOne({ _id: rating.studyId });  // studyId를 통해 Study 컬렉션에서 제목을 찾음
      return {
        ...rating,
        studyTitle: study ? study.title : '스터디 제목 없음'  // 스터디 제목을 추가
      };
    });

    // 받은 평가가 없다면 빈 배열 반환
    return ratingsWithStudyTitle;
    },
    
  });
