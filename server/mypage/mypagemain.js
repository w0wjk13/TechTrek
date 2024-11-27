import { Meteor } from 'meteor/meteor';

// 사용자가 로그인할 때마다 정보를 가져오기 위해 publish 함수 사용
Meteor.publish('userData', function () {
  // Meteor.userId()로 현재 로그인된 사용자 정보 확인
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { profile: 1, email: 1, createdAt: 1 } });
  }
  return this.ready(); // 로그인하지 않았다면 빈 데이터를 반환
});

Meteor.startup(() => {
  // 서버에서 필요한 초기화 작업을 여기서 진행
});
