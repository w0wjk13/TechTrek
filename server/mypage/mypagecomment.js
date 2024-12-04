import { Meteor } from 'meteor/meteor';
import { Comment } from '/imports/api/collections';  // Import the Comment collection
import { Study } from '/imports/api/collections';   // Import the Study collection

Meteor.methods({
  'comment.getUserComments'(nickname) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인 후 사용 가능합니다.');
    }

    // Ensure that the nickname argument is provided
    if (!nickname) {
      throw new Meteor.Error('missing-nickname', '사용자 닉네임이 필요합니다.');
    }

    // Find comments made by the current user (matched by nickname)
    const userComments = Comment.find({ nickname }).fetch();

    if (!userComments.length) {
      throw new Meteor.Error('no-comments', '댓글이 없습니다.');
    }

    // 댓글에 스터디 제목을 추가
    const commentsWithStudyInfo = userComments.map(comment => {
      // 각 댓글에 해당하는 스터디 정보 가져오기
      const study = Study.findOne({ _id: comment.studyId });
      return {
        ...comment,
        studyName: study?.title || '스터디 정보 없음', // 스터디 제목 (없으면 기본 메시지)
      };
    });

    return commentsWithStudyInfo;
  },
  'comment.deleteComment'(commentId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인 후 삭제할 수 있습니다.');
    }

    // 댓글 존재 여부 확인
    const comment = Comment.findOne(commentId);
    if (!comment) {
      throw new Meteor.Error('comment-not-found', '해당 댓글을 찾을 수 없습니다.');
    }

    // 해당 사용자가 댓글 작성자인지 확인
    if (comment.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', '자신의 댓글만 삭제할 수 있습니다.');
    }

    // 댓글 삭제
    Comment.remove(commentId);
  },
});
