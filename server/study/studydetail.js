import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections';

if (Meteor.isServer) {
  Meteor.methods({
    // 스터디 정보 조회 메서드
    'study.getStudyDetails'(id) {
      if (typeof id !== 'string') {
        throw new Meteor.Error('invalid-id', '스터디 ID는 문자열이어야 합니다.');
      }

      const study = Study.findOne(id);
      if (!study) {
        throw new Meteor.Error('study-not-found', '해당 ID에 대한 스터디를 찾을 수 없습니다.');
      }

      return study;  // 스터디 정보를 반환
    },

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

    // 스터디 신청 메서드
    'study.apply'(studyId) {
      // 로그인 확인
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 신청할 수 있습니다.');
      }

      // 신청자가 이미 신청한 상태인지 확인
      const existingApplication = Application.findOne({ studyId, userId: this.userId });
      if (existingApplication) {
        throw new Meteor.Error('already-applied', '이미 신청한 상태입니다.');
      }

      // 신청 정보 추가
      Application.insert({
        studyId,
        userId: this.userId,
        state: '신청됨',  // 상태를 state로 변경
        createdAt: new Date(),
      });
    },

    // 신청 수락 메서드
    'study.acceptApplication'(studyId, applicantId) {
      // 로그인 확인
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 수락할 수 있습니다.');
      }

      // 스터디 작성자인지 확인
      const study = Study.findOne(studyId);
      if (!study || study.userId !== this.userId) {
        throw new Meteor.Error('not-authorized', '작성자만 신청을 수락할 수 있습니다.');
      }

      // 신청된 유저가 존재하는지 확인
      const application = Application.findOne({ studyId, userId: applicantId });
      if (!application) {
        throw new Meteor.Error('application-not-found', '해당 신청자가 없습니다.');
      }

      // 신청 상태를 '수락됨'으로 변경
      Application.update(application._id, {
        $set: { state: '수락됨' },  // 상태를 state로 변경
      });
    },

    // 신청 거절 메서드
    'study.rejectApplication'(studyId, applicantId) {
      // 로그인 확인
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 거절할 수 있습니다.');
      }

      // 스터디 작성자인지 확인
      const study = Study.findOne(studyId);
      if (!study || study.userId !== this.userId) {
        throw new Meteor.Error('not-authorized', '작성자만 신청을 거절할 수 있습니다.');
      }

      // 신청된 유저가 존재하는지 확인
      const application = Application.findOne({ studyId, userId: applicantId });
      if (!application) {
        throw new Meteor.Error('application-not-found', '해당 신청자가 없습니다.');
      }

      // 신청 삭제 (거절)
      Application.remove(application._id);
    },
  });
}
