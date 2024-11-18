// /imports/api/studynotifications.js
import { Meteor } from "meteor/meteor";
import { StudyNotifications } from "/imports/api/collections"; // StudyNotifications 컬렉션 import

Meteor.methods({
  'studyNotifications.create'(studyId, requesterId, creatorId) {
    // 로그인된 사용자만 알림 생성 가능
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인된 유저만 요청할 수 있습니다.');
    }

    const notification = {
      studyId,
      requesterId,
      creatorId,
      status: 'pending',           // 초기 상태는 'pending'
      requestedAt: new Date(),      // 요청 시간
      respondedAt: null             // 응답 시간 (초기값 null)
    };

    return StudyNotifications.insert(notification);
  },

  'studyNotifications.updateStatus'(notificationId, status) {
    // 로그인된 사용자만 알림 상태 업데이트 가능
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인된 유저만 상태를 변경할 수 있습니다.');
    }

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Meteor.Error('invalid-status', '상태는 pending, accepted, rejected만 가능합니다.');
    }

    const notification = StudyNotifications.findOne(notificationId);
    if (!notification) {
      throw new Meteor.Error('notification-not-found', '알림을 찾을 수 없습니다.');
    }

    const updateFields = {
      status,
      respondedAt: status === 'pending' ? null : new Date()  // 상태가 'pending'이 아니면 응답 시간 기록
    };

    return StudyNotifications.update(notificationId, { $set: updateFields });
  },
});

// 주석 처리된 더미 데이터 생성 코드
// 필요 시 주석을 해제하고 테스트에 사용할 수 있습니다.

// Meteor.startup(() => {
//   const user = Meteor.users.findOne({ username: "admin" });
//   if (!user) {
//     console.log("Admin user not found. Please ensure admin is created first.");
//     return;
//   }

//   const studyId = "study1"; // 예시로 고정된 studyId 사용
//   for (let i = 1; i <= 100; i++) {
//     const requesterId = `user${i}`; // user1, user2, ... user100
//     const creatorId = `user${(i % 100) + 1}`; // creatorId는 순차적으로 할당

//     Meteor.call("studyNotifications.create", studyId, requesterId, creatorId, { userId: user._id }, (error, result) => {
//       if (error) {
//         console.log(`Error creating notification for user${i}:`, error);
//       } else {
//         console.log(`Notification created for user${i}:`, result);
//       }
//     });
//   }
// });
