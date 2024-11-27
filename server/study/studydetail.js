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
        state: '신청',
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
    userIds: { $in: [applicantId] },  // userIds 배열에 applicantId가 포함되어 있는지 확인
  });

  if (!application) {
    console.log(`신청자 찾기 실패. studyId: ${studyId}, applicantId: ${applicantId}`);
    throw new Meteor.Error('application-not-found', '해당 신청자가 없습니다.');
  }

  // 신청 상태를 '수락됨'으로 업데이트 (현재 신청자만)
  const updatedStates = application.states.map((state, index) => {
    if (application.userIds[index] === applicantId) {
      return '수락';  // 해당 신청자만 '수락됨'으로 업데이트
    }
    return state;  // 나머지 신청자 상태는 변경하지 않음
  });

  Application.update(application._id, {
    $set: { states: updatedStates },
  });

  // 수락된 신청자 수 확인
  const acceptedApplicantIndexes = updatedStates
    .map((state, index) => state === '수락' ? index : -1)
    .filter(index => index !== -1);  // '수락됨' 상태인 인덱스만 필터링

  const acceptedApplicantsCount = acceptedApplicantIndexes.length;
  console.log(`수락된 신청자 수: ${acceptedApplicantsCount}`);

  // 작성자 포함 총 인원
  const totalParticipants = acceptedApplicantsCount + 1;  // 작성자 포함

  console.log(`작성자 포함 총 인원 수: ${totalParticipants}`);
  console.log(`스터디 모집 인원: ${study.studyCount}`);

  // 모집 인원보다 신청자가 많을 수 없다는 조건
  if (totalParticipants > study.studyCount) {
    throw new Meteor.Error('too-many-participants', `최대 ${study.studyCount}명까지 신청할 수 있습니다.`);
  }
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
        $set: { states: application.states.map(state => state === '신청' ? '거절' : state) },
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
  
  // 해당 스터디의 모든 신청서 데이터 가져오기
  const application = Application.findOne({ studyId });

  if (!application) {
    throw new Meteor.Error('application-not-found', '해당 스터디에 대한 신청서가 없습니다.');
  }

  // '수락됨' 상태인 신청자의 인덱스를 찾고, 그에 해당하는 userIds 배열을 추출
  const acceptedApplicantIndexes = application.states
    .map((state, index) => state === '수락' ? index : -1)  // '수락됨' 상태의 인덱스만 필터링
    .filter(index => index !== -1);  // -1은 제외

  // 수락된 신청자 수
  const acceptedApplicantsCount = acceptedApplicantIndexes.length;
  console.log(`수락된 신청자 수: ${acceptedApplicantsCount}`);

  const totalParticipants = acceptedApplicantsCount + 1;  // 작성자 포함

  console.log(`작성자 포함 총 인원 수: ${totalParticipants}`);
  console.log(`스터디 모집 인원: ${study.studyCount}`);

  // 최소 1명의 수락된 신청자가 있어야만 스터디를 시작할 수 있음
  if (acceptedApplicantsCount < 1) {
    throw new Meteor.Error('insufficient-participants', '최소 1명이 수락되어야 스터디를 시작할 수 있습니다.');
  }

  // 모집 마감일이 지난 경우 자동으로 '모집마감' 상태로 변경
  if (study.studyClose && new Date() > new Date(study.studyClose)) {
    newStatus = '모집마감';
    console.log(`모집 마감일이 지나서 상태가 '모집마감'으로 변경되었습니다.`);
  }

  // 상태 변경 (진행, 종료 등을 'progress'로 반영)
  if (study.status === '진행') {
    if (study.progress !== '진행') {
      console.log('스터디 시작: 진행으로 상태 변경');
      Application.update(application._id, { 
        $set: { progress: '진행' } 
      });
    }
  } else if (study.status === '종료') {
    if (study.progress !== '종료') {
      console.log('스터디 종료: 종료로 상태 변경');
      Application.update(application._id, { 
        $set: { progress: '종료' } 
      });
    }
  } else {
    throw new Meteor.Error('invalid-status', '유효하지 않은 상태입니다.');
  }

  // 상태 변경
  console.log(`상태 변경: ${study.status}`);
  Study.update(studyId, { $set: { status: study.status } });

  return true;
}
,
  });
}
