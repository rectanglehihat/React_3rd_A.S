import React from "react";
import _ from "lodash";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {

    const {children, callNext, is_next, loading} = props;

    const _handleScroll = _.throttle(() => {
        //스크롤 계산위해 가져오기
        const { innerHeight } = window; 
        const { scrollHeight } = document.body;

        // 스크롤 계산(브라우저 호환성 위해 아래와 같이 기입)
        const scrollTop =
        //도큐먼트 아래에 도큐먼트앨리먼트가 있니? 있으면 스크롤탑을 가져와라
        (document.documentElement && document.documentElement.scrollTop) ||
        //안되면 도큐먼트 바디의 스크롤탑을 가져와라
        document.body.scrollTop;

        if (scrollHeight - innerHeight - scrollTop < 200) {
            // 로딩 중이면 다음 걸 부르면 안돼
            if (loading) {
              return;
            }
      
            callNext();
          }
        }, 300);

    //loading이 변할때마다(true로) _handleScroll 함수 실행
    const handleScroll = React.useCallback(_handleScroll, [loading]);

    React.useEffect(() => {

        if(loading){
            return;
        }

        if(is_next){
            window.addEventListener("scroll", handleScroll);
        }else{
            return () => window.removeEventListener("scroll", handleScroll)
        }

        return () => window.removeEventListener("scroll", handleScroll)
    }, [is_next, loading])

    return(
        <React.Fragment>
            {props.children}
            {is_next && <Spinner />}
        </React.Fragment>
    )
}

InfinityScroll.defaultProps = {
    children: null,
    // 끝에 닿으면 다음 목록 불러오는 함수
    callNext: () => {},
    // 다음게 있는지 없는지 알아야함(그래야 콜넥스트를 부를지 말지 알 수 있음)
    is_next: false,
    // 그래야 스크롤 내리다가 다음거 불러오지도 않았는데 또 부르는것 막음
    loading: false,
  };

export default InfinityScroll;