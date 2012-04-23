
#include "SDPSession.h"
#include "CallControlManager.h"
#include "CC_Device.h"
#include "CC_Call.h"
#include "CC_Observer.h"
#include <string>


class SDPSessionSIPCC : public SDPSessionInterface, CSF::CC_Observer {
public:
  SDPSessionSIPCC();
  ~SDPSessionSIPCC();
    
  virtual StatusCode Initialize();
  virtual StatusCode CreateOffer(const std::string& hints, std::string *offer);
  virtual StatusCode CreateAnswer(const std::string& hints, const  std::string& offer, std::string* answer);
  virtual StatusCode SetLocalDescription(/*Action action,*/ const  std::string& sdp);
  virtual StatusCode SetRemoteDescription(/*Action action,*/ const std::string& sdp);
  virtual const std::string& localDescription() const;
  virtual const std::string& remoteDescription() const;
  
  virtual void onDeviceEvent(ccapi_device_event_e deviceEvent, CSF::CC_DevicePtr device, CSF::CC_DeviceInfoPtr info ) {}
  virtual void onFeatureEvent(ccapi_device_event_e deviceEvent, CSF::CC_DevicePtr device, CSF::CC_FeatureInfoPtr feature_info) {}
  virtual void onLineEvent(ccapi_line_event_e lineEvent, CSF::CC_LinePtr line, CSF::CC_LineInfoPtr info ) {}
  virtual void onCallEvent(ccapi_call_event_e callEvent, CSF::CC_CallPtr call, CSF::CC_CallInfoPtr info, char* sdp ) {}
  
private:
  SDPSessionSIPCC( const SDPSessionSIPCC &rhs );  
  SDPSessionSIPCC& operator=( SDPSessionSIPCC );   
  std::string addr_;
  CSF::CallControlManagerPtr ccm_;
  CSF::CC_DevicePtr dev_; 
  CSF::CC_CallPtr call_;  
};
 
