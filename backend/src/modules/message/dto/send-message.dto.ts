interface SendMessageDto {
  text: string;
  files: { type: 'file' | 'image' | 'video'; url: string; name?: string }[];
  receiverId: string;
}

export default SendMessageDto;
