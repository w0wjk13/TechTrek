import { Meteor } from 'meteor/meteor';
import { Rating } from '/imports/api/collections';  // Rating 컬렉션

Meteor.methods({
    'study.getRatingsForUser'(userId) {
      if (typeof userId !== 'string') {
        throw new Meteor.Error('invalid-user-id', '사용자 ID는 문자열이어야 합니다.');
      }
  
      // 해당 유저가 받은 평가 목록 가져오기
    const ratings = Rating.find({ ratedUserId: userId }).fetch();

      // 받은 평가가 없다면 빈 배열 반환
      return ratings;
    },
    
  });
