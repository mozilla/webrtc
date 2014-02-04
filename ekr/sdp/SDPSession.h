
#include <string>

enum StatusCode { SDP_OK = 2001, SDP_CREATE_OFFER_FAIL = 2002, SDP_CREATE_ANSWER_FAIL = 2003 };

class SDPSessionInterface {
public:
  virtual StatusCode Initialize(PeerConnectionObserver* observer) = 0;
  virtual StatusCode CreateOffer(const std::string& hints, std::string *offer) = 0;
  virtual StatusCode CreateAnswer(const std::string& hints, const  std::string& offer, std::string* answer) = 0;
  virtual StatusCode SetLocalDescription(/*Action action,*/ const  std::string& sdp) = 0;
  virtual StatusCode SetRemoteDescription(/*Action action,*/ const std::string& sdp) = 0;
  virtual const std::string& localDescription() const = 0;
  virtual const std::string& remoteDescription() const = 0;

  virtual void AddStream(LocalMediaStreamInterface* stream);    
  virtual void RemoveStream(LocalMediaStreamInterface* stream);
};


class SDPSessionFactoryInterface {
public:
  virtual SDPSessionInterface *CreateSDPSession() = 0;
  
protected:   
  SDPSessionFactoryInterface() {}
  ~SDPSessionFactoryInterface() {}
};


class SDPSessionFactory : public SDPSessionFactoryInterface {
public:
   SDPSessionInterface *CreateSDPSession();
};

