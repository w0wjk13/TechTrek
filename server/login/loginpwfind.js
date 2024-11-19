import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  process.env.MAIL_URL = 'smtps://yy55kj@gmail.com:hoqeoasizysmcufc@smtp.gmail.com:465'; // Gmail SMTP 설정
});

Meteor.methods({
  findUserPassword(name, email, phone) {
    // 입력 값 검증
    if (!name || !email || !phone) {
      throw new Meteor.Error('invalid-input', '모든 정보를 입력해 주세요.');
    }

    // 사용자 검색
    const user = Meteor.users.findOne({
      'profile.name': name,
      'emails.0.address': email,
      'profile.phone': phone,
    });

    if (user) {
      // 랜덤한 새 비밀번호 8자리 생성
      const newPassword = Random.id(8); // 8자리 랜덤 문자열 생성

      // 새 비밀번호를 사용자 계정에 설정
      Accounts.setPassword(user._id, newPassword); // 암호화된 비밀번호로 자동 설정

      // 이메일로 새 비밀번호 전송
      Email.send({
        to: email,
        from: 'yy55kj@gmail.com',
        subject: '새 비밀번호 안내',
        text: `안녕하세요, ${name}님.\n\n요청하신 새 비밀번호는 다음과 같습니다: ${newPassword}\n\n이 비밀번호로 로그인하신 후, 비밀번호를 변경해 주세요.`,
      });

      return '새 비밀번호가 이메일로 전송되었습니다.'; // 클라이언트로 성공 메시지 반환
    } else {
      throw new Meteor.Error('user-not-found', '해당 정보를 가진 사용자가 없습니다.');
    }
  },
});
