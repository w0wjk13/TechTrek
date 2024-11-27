import { Meteor } from 'meteor/meteor';
import { Study, Comment, Application } from '/imports/api/collections';

if (Meteor.isServer) {
  // 공통 타입 체크 함수
  const checkString = (value, errorCode, errorMessage) => {
    if (typeof value !== 'string') {
      throw new Meteor.Error(errorCode, errorMessage);
    }
  };

  Meteor.methods({
    // 스터디 정보 조회 메서드
    'study.getStudyDetails'(id) {
      checkString(id, 'invalid-id', '스터디 ID는 문자열이어야 합니다.');

      const study = Study.findOne(id);
      if (!study) {
        throw new Meteor.Error('study-not-found', '해당 ID에 대한 스터디를 찾을 수 없습니다.');
      }

      return study;  // 스터디 정보를 반환
    },

    // 스터디 조회수 증가 메서드
    'study.incrementViews'(id) {
      checkString(id, 'invalid-id', '스터디 ID는 문자열이어야 합니다.');

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
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 댓글을 작성할 수 있습니다.');
      }

      if (!commentContent.trim()) {
        throw new Meteor.Error('invalid-comment', '댓글 내용이 비어 있습니다.');
      }

      const study = Study.findOne(studyId);
      if (!study) {
        throw new Meteor.Error('study-not-found', '스터디를 찾을 수 없습니다.');
      }

      const newComment = {
        userId: this.userId,
        nickname: Meteor.user()?.profile?.nickname || Meteor.user()?.username || '알 수 없음',
        content: commentContent,
        createdAt: new Date(),
        studyId: studyId,
      };

      Comment.insert(newComment);
    },

    // 스터디 신청 메서드
    'study.apply'(studyId) {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 신청할 수 있습니다.');
      }

      const study = Study.findOne(studyId);
      if (!study) {
        throw new Meteor.Error('study-not-found', '스터디를 찾을 수 없습니다.');
      }

      if (study.userId === this.userId) {
        throw new Meteor.Error('not-authorized', '작성자는 신청할 수 없습니다.');
      }

      const existingApplication = Application.findOne({ studyId, userId: this.userId });
      if (existingApplication) {
        throw new Meteor.Error('already-applied', '이미 신청한 상태입니다.');
      }

      Application.insert({
        studyId,
        userId: this.userId,
        state: '신청됨',
        createdAt: new Date(),
      });
    },

    // 신청 수락 메서드
    'study.acceptApplication'(studyId, applicantId) {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 수락할 수 있습니다.');
      }

      const study = Study.findOne(studyId);
      if (!study || study.userId !== this.userId) {
        throw new Meteor.Error('not-authorized', '작성자만 신청을 수락할 수 있습니다.');
      }

      const application = Application.findOne({
        studyId: studyId,
        userIds: { $in: [applicantId] }  // userIds 배열에 applicantId가 포함되어 있는지 확인
      });

      if (!application) {
        console.log(`신청자 찾기 실패. studyId: ${studyId}, applicantId: ${applicantId}`);
        throw new Meteor.Error('application-not-found', '해당 신청자가 없습니다.');
      }

      // 신청 상태를 '수락됨'으로 업데이트
      Application.update(application._id, {
        $set: { states: application.states.map(state => state === '신청됨' ? '수락됨' : state) },
      });
    },

    // 신청 거절 메서드
    'study.rejectApplication'(studyId, applicantId) {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', '로그인 후 거절할 수 있습니다.');
      }

      const study = Study.findOne(studyId);
      if (!study || study.userId !== this.userId) {
        throw new Meteor.Error('not-authorized', '작성자만 신청을 거절할 수 있습니다.');
      }

      const application = Application.findOne({
        studyId: studyId,
        userIds: { $in: [applicantId] }  // userIds 배열에 applicantId가 포함되어 있는지 확인
      });

      if (!application) {
        console.log(`신청자 찾기 실패. studyId: ${studyId}, applicantId: ${applicantId}`);
        throw new Meteor.Error('application-not-found', '해당 신청자가 없습니다.');
      }

      // 신청자를 거절 상태로 처리
      Application.update(application._id, {
        $set: { states: application.states.map(state => state === '신청됨' ? '거절됨' : state) },
      });
    },


    // 스터디 상태 변경 메서드
    'study.updateStatus'(studyId, newStatus) {
      checkString(studyId, 'invalid-argument', 'studyId는 문자열이어야 합니다.');
      checkString(newStatus, 'invalid-argument', 'newStatus는 문자열이어야 합니다.');

      const userId = Meteor.userId();
      const study = Study.findOne(studyId);

      if (!study) {
        throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
      }

      if (study.userId !== userId) {
        throw new Meteor.Error('not-authorized', '작성자만 상태를 변경할 수 있습니다.');
      }

      Study.update(studyId, { $set: { status: newStatus } });
      return true;
    },
  });
}
