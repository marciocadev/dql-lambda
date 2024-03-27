export const handler = async (event: any) => {
  console.log(event.Records[0].Sns.Message);

  const message = {
    MessageBody: `Message at ${Date()}`,
  };

  if (event.Records[0].Sns.Message == 'fail') {
    console.log('error');
    throw new Error('ERROR!');
  } else {
    console.log(message);
    return { message };
  }
};