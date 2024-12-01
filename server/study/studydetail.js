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

// 스터디 종료 메서드
'study.endStudy'(studyId, endDate) {
  // 권한 체크
  if (!this.userId) {
    throw new Meteor.Error('not-authorized', '로그인 후 종료할 수 있습니다.');
  }

  const study = Study.findOne(studyId);
  if (!study) {
    throw new Meteor.Error('study-not-found', '스터디를 찾을 수 없습니다.');
  }

  // 작성자만 종료 가능
  if (study.userId !== Meteor.user()?.profile?.nickname) {
    throw new Meteor.Error('not-authorized', '작성자만 스터디를 종료할 수 있습니다.');
  }

  // Application 컬렉션에서 해당 studyId를 가진 '진행' 상태의 신청서들만 '종료'로 업데이트
  const result = Application.update(
    { studyId: studyId, progress: '진행' },  // studyId가 일치하고 progress가 '진행'인 경우
    { 
      $set: { 
        progress: '종료',  // 신청서의 진행 상태를 '종료'로 변경
        endDate: new Date(),   // 마감일 설정
      }
    },
    { multi: true }  // 여러 개의 신청서들 한 번에 업데이트
  );

  // 업데이트 결과를 반환
  if (result) {
    return { success: true, progress: '종료', endDate };
  } else {
    throw new Meteor.Error('update-failed', '신청서 상태 업데이트 실패');
  }
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

      if (study.userId === Meteor.user()?.profile?.nickname) {
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
  if (!study || study.userId !== Meteor.user()?.profile?.nickname) {
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
  

  // 작성자 포함 총 인원
  const totalParticipants = acceptedApplicantsCount + 1;  // 작성자 포함

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
      if (!study || study.userId !== Meteor.user()?.profile?.nickname) {
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
'study.updateStatus'(studyId, status, progress) {
  checkString(studyId, 'invalid-argument', 'studyId는 문자열이어야 합니다.');

  const userId = Meteor.userId();
  const study = Study.findOne(studyId);

  if (!study) {
    throw new Meteor.Error('study-not-found', '해당 스터디를 찾을 수 없습니다.');
  }

  if (study.userId !== Meteor.user()?.profile?.nickname) {
    throw new Meteor.Error('not-authorized', '작성자만 상태를 변경할 수 있습니다.');
  }

  // "모집중" 상태에서 "모집완료"로 변경
  if (study.status === '모집중') {
    // 스터디 상태를 '모집완료'로 변경
    Study.update(studyId, {
      $set: { status: '모집완료' },
    });

    // 신청자 상태 업데이트
    const applications = Application.find({ studyId }).fetch();
    applications.forEach((application) => {
      const updatedStates = application.states.map((state, index) => {
        if (application.userIds[index] === study.userId) {
          return '수락';  // 작성자는 항상 '수락' 처리
        }
        return state;  // 신청자는 상태 그대로
      });

      // 신청자의 상태를 업데이트
      Application.update(application._id, {
        $set: { states: updatedStates },
      });
    });
  }

  // "모집완료" 상태에서 신청자 상태 처리
  if (status === '모집완료') {
    const applications = Application.find({ studyId }).fetch();
    if (applications.length === 0) {
      throw new Meteor.Error('application-not-found', '해당 스터디에 대한 신청서가 없습니다.');
    }

    applications.forEach((application) => {
      const updatedStates = application.states.map((state, index) => {
        if (application.userIds[index] === study.userId) {
          return '수락';  // 작성자는 항상 '수락'
        } else if (state !== '수락') {
          return '거절';  // '수락'이 아닌 경우 '거절'
        }
        return state;
      });

      // 신청자의 상태 업데이트 (수락이 아니면 '거절'로)
      Application.update(application._id, {
        $set: { states: updatedStates },
      });

      // '거절' 상태인 신청자를 삭제 (수락된 신청자만 남김)
      application.userIds.forEach((userId, index) => {
        if (updatedStates[index] === '거절') {
          
          // '거절'된 신청자는 삭제
          Application.update(
            { _id: application._id },  // 해당 application의 ID
            { $pull: { userIds: userId } }  // userIds 배열에서 해당 userId를 삭제
          );
        }
      });

      // 수락된 신청자만 '진행' 상태로 변경
      if (updatedStates.includes('수락')) {
        Application.update(application._id, {
          $set: {
            progress: '진행',  // '진행' 상태로 설정
            startDate: new Date(),  // 현재 날짜를 시작 날짜로 설정
          },
        });
      }
    });
  }

  // 'progress' 파라미터를 사용한 처리 (신청자의 진행 상태 변경)
  if (progress) {
    const applications = Application.find({ studyId }).fetch();
    applications.forEach((application) => {
      const updatedProgress = application.progress === '진행' ? progress : application.progress;

      // 신청자의 진행 상태 업데이트
      Application.update(application._id, {
        $set: { progress: updatedProgress },
      });
     
    });
  }

  // 모집 마감일이 지난 경우 자동으로 '모집마감' 상태로 변경
  if (study.studyClose && new Date() > new Date(study.studyClose)) {
    Study.update(studyId, {
      $set: { status: '모집마감' },
    });

    console.log(`모집 마감일이 지나서 상태가 '모집마감'으로 변경되었습니다.`);
  }

  return true;

    },
  });
}