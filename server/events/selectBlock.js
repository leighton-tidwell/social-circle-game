import { blockModel } from '../models';

export default function selectBlock(io, socket) {
  return async ({ player, influencerChatId }) => {
    try {
      const findBlocks = await blockModel.findOne({
        influencerChatId: influencerChatId,
      });

      if (!findBlocks) {
        const newBlockEntry = {
          influencerChatId,
          blocks: [
            {
              player: socket.id,
              block: player,
            },
          ],
        };
        const saveBlock = new blockModel(newBlockEntry);
        await saveBlock.save();
        return;
      }

      const indexOfPlayerChoice = findBlocks.blocks.findIndex(
        (d) => d.player === socket.id
      );

      if (indexOfPlayerChoice === -1) {
        const newBlockEntry = [
          ...findBlocks.blocks,
          {
            player: socket.id,
            block: player,
          },
        ];

        await blockModel.updateOne(
          { influencerChatId: influencerChatId },
          { blocks: newBlockEntry }
        );
        return;
      }

      let newBlockEntry = [...findBlocks.blocks];
      newBlockEntry[indexOfPlayerChoice] = {
        player: socket.id,
        block: player,
      };
      await blockModel.updateOne(
        { influencerChatId: influencerChatId },
        { blocks: newBlockEntry }
      );
      return;
    } catch (error) {
      console.log('Error in selecting block: ', error);
    }
  };
}
