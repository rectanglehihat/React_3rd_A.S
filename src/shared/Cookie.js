// 쿠키 가져오기(키:밸류 형태니까 키인 name으로 가져옴)
const getCookie = (name) => {
    let value = "; " + document.cookie;
    // 키 값을 기준으로 파싱합니다.(쿠키가 불편한 이유ㅋ)
    let parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
          return parts.pop().split(";").shift();
      }
  };
  
  // 쿠키 추가(클라이언트 토큰 저장소인 쿠키에 저장)
  const setCookie = (name, value, exp = 5) => {
    // 날짜를 만들어 저장
    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value};expires=${date.toUTCString()}`;
  };
  
  // 쿠키 삭제 (만료일을 예전으로 설정해서)
  const deleteCookie = (name) => {
      let date = new Date("2020-01-01").toDateString();
        
      console.log(date);
      
      document.cookie = name + "=; expires=" + date;
  }
  
  export { getCookie, setCookie, deleteCookie };