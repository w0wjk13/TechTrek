import { Meteor } from 'meteor/meteor';
import { Study, Comment } from '/imports/api/collections';  // Comment 컬렉션도 가져오기

if (Meteor.isServer) {
  Meteor.methods({
    // 스터디 조회수 증가 메서드
    'study.incrementViews'(id) {
      if (typeof id !== 'string') {
        throw new Meteor.Error('invalid-id', '스터디 ID는 문자열이어야 합니다.');
      }

      const study = Study.findOne(id);
      if (!study) {
        throw new Meteor.Error('study-not-found', '해당 ID에 대한 스터디를 찾을 수 없습니다.');
      }

      Study.update(id, {
        $set: { views: study.views + 1 },
      });
    },

    // 댓글 추가 메서드
    'study.addComment'(studyId, commentContent) {
      // 로그인 확인
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 댓글을 작성할 수 있습니다.');
      }

      // 댓글 내용 확인
      if (!commentContent.trim()) {
        throw new Meteor.Error('invalid-comment', '댓글 내용이 비어 있습니다.');
      }

      // 해당 스터디가 존재하는지 확인
      const study = Study.findOne(studyId);
      if (!study) {
        throw new Meteor.Error('study-not-found', '스터디를 찾을 수 없습니다.');
      }

      // 댓글 작성자 정보
      const newComment = {
        userId: this.userId,  // 댓글 작성자의 userId
        nickname: Meteor.user()?.profile?.nickname || Meteor.user()?.username || '알 수 없음',  // 댓글 작성자의 닉네임
        content: commentContent,  // 댓글 내용
        createdAt: new Date(),  // 댓글 작성일
        studyId: studyId,  // 댓글이 속한 스터디 ID
      };

      // comment 컬렉션에 댓글 추가
      Comment.insert(newComment);
    },
  });
}
