interface SendMessageDto {
  text: string;
  files: { type: 'file' | 'image' | 'video'; url: string }[];
}

export default SendMessageDto;
