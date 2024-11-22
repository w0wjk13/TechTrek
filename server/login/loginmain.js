import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Study, StudyUsers, Files } from '/imports/api/collections';

Meteor.startup(() => {
  // 서버 재시작 시 클라이언트 세션을 종료하기 위해 서버 측에서 클라이언트에게 로그아웃 요청을 보냄
  if (Meteor.isServer) {
    // 서버가 재시작되면 클라이언트에게 로그아웃 명령을 보내도록 합니다.
    // 서버에서는 클라이언트에게 로그아웃 명령을 내려야 함
    Meteor.publish('logoutAllClients', function () {
      this.ready(); // No data is actually sent, just an event to trigger on the client side
    });
  }

  // Accounts 설정: 로그인 세션 만료 시간을 0일로 설정
  Accounts.config({
    loginExpirationInDays: 0,  // 로그인 만료일을 0일로 설정하여, 서버가 재시작되면 세션이 만료되도록
  });

  // 사용자 등록 시 필수 검증
  Accounts.onCreateUser((options, user) => {
    // 사용자 이메일, 비밀번호, 기술 스택 등 추가 정보 처리
    if (options.profile) {
      user.profile = options.profile;
    }

    // 이름 필수 체크
    if (!user.profile || !user.profile.name) {
      throw new Meteor.Error(403, "이름을 입력해주세요.");
    }

    return user; // 사용자를 반환해야 계정이 생성됨
  });
});

if (Meteor.isClient) {
  // 클라이언트 측에서 로그아웃 처리
  Meteor.subscribe('logoutAllClients', () => {
    // 서버가 재시작되면 클라이언트에서 로그아웃
    Meteor.logout(() => {
      console.log("서버가 재시작되어 클라이언트 세션이 로그아웃되었습니다.");
    });

    // 클라이언트 측에서 로그인 세션 초기화
    localStorage.clear();

    // 모든 관련 쿠키 삭제
    document.cookie = 'Meteor.loginToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'Meteor.loginTokenExpires=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'Meteor.loginTokenSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // 추가적으로, 서버가 설정한 다른 쿠키들도 삭제해야 할 수 있습니다.
    document.cookie = 'Meteor.loginServiceConfiguration=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // 페이지 새로고침
    location.reload();
  });
}

// 로그인 후 특정 로직 처리 (예시)
Meteor.methods({
  'users.checkEmailAvailability'(email) {
    check(email, String);
    return !Meteor.users.findOne({ email });
  },

  // 클라이언트 세션 로그아웃 처리
  'logoutClientSession'() {
    if (this.userId) {
      Meteor.logout(); // 클라이언트에서 로그아웃 처리
    } else {
      throw new Meteor.Error('not-authorized', '로그인된 사용자가 아닙니다.');
    }
  }
});
if (Meteor.isServer) {
  // 서버가 재시작되면 클라이언트에게 로그아웃 명령을 보내도록 합니다.
  Meteor.publish('logoutAllClients', function () {
    this.ready(); // 클라이언트에 데이터를 보내지 않고, 클라이언트에서 이벤트를 감지하게 합니다.
  });
}