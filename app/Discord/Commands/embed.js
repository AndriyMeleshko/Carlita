const { EmbedBuilder } = require('discord.js');

const env = process.env;

const Author = { name: 'Discord', url: 'https://discord.com/' };
const Description = 'Discord Terms';
const Image = env.StripMenu;
const Footer = { text: 'Discord', iconURL: env.DiscordGif };

const TermsEn = `
**1**. Open your Discord account settings.
**2**. Go to the **Connection** menu tab.
**3**. Connect your Twitch account.
**4**. Turn on **Display in profile**.
**5**. Tell our administrators about the actions taken.
`;

const TermsUk = `
**1**. Відкрийте налаштування вашого облікового запису Discord.
**2**. Перейдіть до вкладки меню **З'єднання**.
**3**. Підключіть свій обліковий запис Twitch.
**4**. Увімкніть **Відображати у профілі**.
**5**. Повідомте нашим адміністраторам про виконані дії.
`;

const EmbedTerm = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: 'Read the rules in English and Ukrainian', inline: true },
    { name: '\u200B', value: 'Читайте правила англійською та українською мовами', inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermEn = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: 'Read the terms in English', inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermUk = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: 'Читайте умови українською', inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermEn1 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 1', inline: true },
    { name: '\u200B', value: `How do I get a **@role** that allows me to see most channels?\n\n${TermsEn}`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermEn2 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 2', inline: true },
    { name: '\u200B', value: 'Communicate in **Ukrainian**.\nTreat everyone with **respect**. Absolutely **no** harassment, witch hunting, sexism, racism, or hate speech will be tolerated.', inline: true },
    // { name: '\u200B', value: `**This server** contains flashing images that may cause discomfort or trigger seizures for peop with photosensitive [epilepsy](${env.Epilepsy}).\n_**Viewer discretion is advised.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermEn3 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 3', inline: true },
    { name: '\u200B', value: '**No** spam or self-promotion (server invites, advertisements, etc) without permission from a staff member. This includes DMing fellow members.', inline: true },
    // { name: '\u200B', value: `**This server** contains flashing images that may cause discomfort or trigger seizures for peop with photosensitive [epilepsy](${env.Epilepsy}).\n_**Viewer discretion is advised.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermEn4 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 4', inline: true },
    { name: '\u200B', value: '**No** NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.', inline: true },
    // { name: '\u200B', value: `**This server** contains flashing images that may cause discomfort or trigger seizures for peop with photosensitive [epilepsy](${env.Epilepsy}).\n_**Viewer discretion is advised.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermEn5 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 5', inline: true },
    { name: '\u200B', value: 'If you see something **against** the rules or something that makes you feel unsafe, let staff know. We want this server to be a welcoming space!', inline: true },
    // { name: '\u200B', value: `**This server** contains flashing images that may cause discomfort or trigger seizures for peop with photosensitive [epilepsy](${env.Epilepsy}).\n_**Viewer discretion is advised.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermUk1 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 1', inline: true },
    { name: '\u200B', value: `Як отримати **@роль**, яка дозволить бачити більшість каналів?\n\n${TermsUk}`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermUk2 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 2', inline: true },
    { name: '\u200B', value: 'Спілкуйтеся **українською** мовою.\nСпілкуйтеся **ввічливо**. Категорично **заборонені** агресія, полювання на відьом, расистські, сексистські та ксенофобські висловлювання.', inline: true },
    // { name: '\u200B', value: `**Цей сервер** містить миготливі зображення, які можуть викликати дискомфорт або викликати судоми у людей з світлочутливою [епілепсією](${env.Epilepsy}).\n_**Рекомендується на розсуд глядача.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermUk3 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 3', inline: true },
    { name: '\u200B', value: '**Заборонений** спам та самореклама (запрошення на сервер, рекламні оголошення тощо) без дозволу з боку керівництва, зокрема в приватних повідомленнях.', inline: true },
    // { name: '\u200B', value: `**Цей сервер** містить миготливі зображення, які можуть викликати дискомфорт або викликати судоми у людей з світлочутливою [епілепсією](${env.Epilepsy}).\n_**Рекомендується на розсуд глядача.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermUk4 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 4', inline: true },
    { name: '\u200B', value: 'Контент NSFW (не для перегляду на роботі) та непристойний контент **заборонені**, зокрема тексти, зображення та посилання, що містять оголеність, секс, тяжке насилля чи інший провокативний контент.', inline: true },
    // { name: '\u200B', value: `**Цей сервер** містить миготливі зображення, які можуть викликати дискомфорт або викликати судоми у людей з світлочутливою [епілепсією](${env.Epilepsy}).\n_**Рекомендується на розсуд глядача.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

const EmbedTermUk5 = new EmbedBuilder()
  .setAuthor(Author)
  .setDescription(Description)
  .addFields(
    { name: '\u200B', value: '# 5', inline: true },
    { name: '\u200B', value: 'Якщо побачите **порушення** правил або щось, що вас бентежить, — повідомте адміністрації. Ми хочемо, щоби сервер був комфортним місцем для спілкування!', inline: true },
    // { name: '\u200B', value: `**Цей сервер** містить миготливі зображення, які можуть викликати дискомфорт або викликати судоми у людей з світлочутливою [епілепсією](${env.Epilepsy}).\n_**Рекомендується на розсуд глядача.**_`, inline: true },
  )
  .setImage(Image)
  .setFooter(Footer);

module.exports = {
  EmbedTerm,

  EmbedTermEn,
  EmbedTermUk,

  EmbedTermEn1,
  EmbedTermEn2,
  EmbedTermEn3,
  EmbedTermEn4,
  EmbedTermEn5,

  EmbedTermUk1,
  EmbedTermUk2,
  EmbedTermUk3,
  EmbedTermUk4,
  EmbedTermUk5,
};
