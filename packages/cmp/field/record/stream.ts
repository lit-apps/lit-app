let stream: MediaStream | null = null;

/**
 * @param config configuration for the stream
 * @returns a promise with the stream
 */
export const getStream = async (config: MediaStreamConstraints = {audio: true}): Promise<MediaStream> => {
  if (!stream) {
		stream = await navigator.mediaDevices.getUserMedia(config);
  }
  return stream;
};
/**
 * Stop all streams
 */
export const stopAllStreams = () => {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    stream = null;
  }
};