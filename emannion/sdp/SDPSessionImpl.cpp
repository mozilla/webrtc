
#include "SDPSessionImpl.h"
#include "cpr_socket.h"
#include <string>


// Signatures for address
std::string GetLocalActiveInterfaceAddressSDP();
std::string NetAddressToStringSDP(const struct sockaddr* net_address,
                               socklen_t address_len);
                               
                               
SDPSessionInterface *SDPSessionFactory::CreateSDPSession() {
  return new SDPSessionSIPCC();
}
                         
SDPSessionSIPCC::SDPSessionSIPCC() {
}

                         
SDPSessionSIPCC::~SDPSessionSIPCC() {
  if (ccm_ != NULL) {
    ccm_->disconnect();
    ccm_->destroy();
    // need to set ccm_ to NULL
  }
}

StatusCode SDPSessionSIPCC::Initialize() {
  //if (ccm_ != NULL) {
    addr_ = GetLocalActiveInterfaceAddressSDP();
    ccm_ = CSF::CallControlManager::create();
    ccm_->setLocalIpAddressAndGateway(addr_,"");
    ccm_->startSDPMode("test");
    ccm_->addCCObserver(this);
    dev_ = ccm_->getActiveDevice();	
    call_ = dev_->createCall();
   // }
   
   return SDP_OK;
}

StatusCode SDPSessionSIPCC::CreateOffer(const std::string& hints, std::string *offer) {

  *offer = call_->createOffer(CC_SDP_DIRECTION_SENDRECV, hints);
  
  return SDP_OK;
}

StatusCode SDPSessionSIPCC::CreateAnswer(const std::string& hints, const  std::string& offer, std::string* answer) {

  *answer = call_->createAnswer(CC_SDP_DIRECTION_SENDRECV, hints, "v=0\r\no=Cisco-SIPUA 4949 0 IN IP4 10.86.255.143\r\ns=SIP Call\r\nt=0 0\r\nm=audio 16384 RTP/AVP 0 8 9 101\r\nc=IN IP4 10.86.255.143\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:9 G722/8000\r\na=rtpmap:101 telephone-event/8000\r\na=fmtp:101 0-15\r\na=sendrecv\r\nm=video 1024 RTP/AVP 97\r\nc=IN IP4 10.86.255.143\r\na=rtpmap:97 H264/90000\r\na=fmtp:97 profile-level-id=42E00C\r\na=sendrecv\r\n");

  return SDP_OK;
}

StatusCode SDPSessionSIPCC::SetLocalDescription(/*Action action,*/ const  std::string& sdp) {
  return SDP_OK;
}

StatusCode SDPSessionSIPCC::SetRemoteDescription(/*Action action,*/ const std::string& sdp) {
  return SDP_OK;
} 

const std::string& SDPSessionSIPCC::localDescription() const {
  std::string sdp = "";
  return sdp;
}

const std::string& SDPSessionSIPCC::remoteDescription() const {
  std::string sdp = "";
  return sdp;
}


#include <sys/socket.h>
#include <errno.h>
#include <arpa/inet.h>
#include <fcntl.h>
#include <netdb.h>

// POSIX Only Implementation
std::string GetLocalActiveInterfaceAddressSDP() 
{
	std::string local_ip_address = "0.0.0.0";
#ifndef WIN32
	int sock_desc_ = INVALID_SOCKET;
	sock_desc_ = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	struct sockaddr_in proxy_server_client;
 	proxy_server_client.sin_family = AF_INET;
	proxy_server_client.sin_addr.s_addr	= inet_addr("10.0.0.1");
	proxy_server_client.sin_port = 12345;
	fcntl(sock_desc_,F_SETFL,  O_NONBLOCK);
	int ret = connect(sock_desc_, reinterpret_cast<sockaddr*>(&proxy_server_client),
                    sizeof(proxy_server_client));

	if(ret == SOCKET_ERROR)
	{
	}
 
	struct sockaddr_storage source_address;
	socklen_t addrlen = sizeof(source_address);
	ret = getsockname(
			sock_desc_, reinterpret_cast<struct sockaddr*>(&source_address),&addrlen);

	
	//get the  ip address 
	local_ip_address = NetAddressToStringSDP(
						reinterpret_cast<const struct sockaddr*>(&source_address),
						sizeof(source_address));
	close(sock_desc_);
#else
	hostent* localHost;
	localHost = gethostbyname("");
	local_ip_v4_address_ = inet_ntoa (*(struct in_addr *)*localHost->h_addr_list);
#endif
	return local_ip_address;
}

//Only POSIX Complaint as of 7/6/11
#ifndef WIN32
std::string NetAddressToStringSDP(const struct sockaddr* net_address,
                               socklen_t address_len) {

  // This buffer is large enough to fit the biggest IPv6 string.
  char buffer[128];
  int result = getnameinfo(net_address, address_len, buffer, sizeof(buffer),
                           NULL, 0, NI_NUMERICHOST);
  if (result != 0) {
    buffer[0] = '\0';
  }
  return std::string(buffer);
}
#endif

