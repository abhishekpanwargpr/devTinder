const { SendEmailCommand } = require('@aws-sdk/client-ses')
const {sesClient} = require('./sesClient');

const createSendEmailCommand = (toAddress, fromAddress, body) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
        Body: {
          Html:{
            
          },
          Text: {
            Charset: "UTF-8",
            Data: `${body}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "A new connection request was sent on your website!",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
      ],
    });
  };
  
  const run = async (body) => {
    const sendEmailCommand = createSendEmailCommand(
      "ap759710@gmail.com",
      "abhishek@devtinder.info",
      body
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = {run};