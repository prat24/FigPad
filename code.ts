figma.showUI(__html__, { width: 400, height: 640 });

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'create') {
      const { comment, noteType, profileData } = msg;
      const { imageBytes, username } = profileData;

      const currentPage = figma.currentPage;

      // node type and corresponding colors
      type NoteType = 'note' | 'todo' | 'update';
      const strokeColors: Record<NoteType, { r: number; g: number; b: number }> = {
        note: { r: 0.13, g: 0.58, b: 0.95 }, // blue: note
        todo: { r: 0.56, g: 0, b: 1 }, // purple: todo
        update: { r: 1, g: 0.71, b: 0.27 } // orange: update
      };

      const strokeColor = strokeColors[noteType as NoteType] || { r: 0, g: 0, b: 0 }; // fallback

      // note frame
      const noteFrame = figma.createComponent();
      noteFrame.name = "Note";
      noteFrame.layoutMode = 'VERTICAL';
      noteFrame.counterAxisSizingMode = 'AUTO';
      noteFrame.primaryAxisSizingMode = 'AUTO';
      noteFrame.paddingTop = 16;
      noteFrame.paddingBottom = 16;
      noteFrame.paddingLeft = 24;
      noteFrame.paddingRight = 24;
      noteFrame.itemSpacing = 16;
      noteFrame.primaryAxisAlignItems = 'CENTER';
      noteFrame.counterAxisAlignItems = 'MIN';
      noteFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
      noteFrame.cornerRadius = 16;

      // change stroke color
      noteFrame.strokes = [{ type: 'SOLID', color: strokeColor }];
      noteFrame.strokeAlign = 'INSIDE';
      noteFrame.strokeTopWeight = 0;
      noteFrame.strokeRightWeight = 0;
      noteFrame.strokeBottomWeight = 0;
      noteFrame.strokeLeftWeight = 6; //only left stroke

      // drop shadow
      noteFrame.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.15 },
        offset: { x: 0, y: 4 },
        radius: 12,
        visible: true,
        blendMode: "NORMAL"
      }];

      // profile picture frame
      const profileFrame = figma.createFrame();
      profileFrame.name = "Profile Picture";
      profileFrame.resizeWithoutConstraints(72, 72);
      profileFrame.cornerRadius = 100;
      profileFrame.clipsContent = true;

      if (imageBytes) {
        const profileImage = figma.createImage(new Uint8Array(imageBytes));
        const profilePictureNode = figma.createRectangle();
        profilePictureNode.name = "Photo";
        profilePictureNode.resizeWithoutConstraints(72, 72);
        profilePictureNode.fills = [{ type: 'IMAGE', imageHash: profileImage.hash, scaleMode: 'FILL' }];
        profileFrame.appendChild(profilePictureNode);
      } else {
        profileFrame.visible = false;
      }

      // details frame (contains note type and user name)
      const detailsFrame = figma.createFrame();
      detailsFrame.name = "Details";
      detailsFrame.layoutMode = 'VERTICAL';
      detailsFrame.counterAxisSizingMode = 'AUTO'; 
      detailsFrame.primaryAxisSizingMode = 'AUTO';
      detailsFrame.itemSpacing = 4;
      detailsFrame.primaryAxisAlignItems = 'CENTER';
      detailsFrame.counterAxisAlignItems = 'MIN';
      detailsFrame.layoutGrow = 1;
      detailsFrame.fills = []; 

      // type of note text
      const typeText = figma.createText();
      typeText.name = "Type of Note";
      await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });
      typeText.fontName = { family: "DM Sans", style: "Bold" };
      typeText.characters = noteType.charAt(0).toUpperCase() + noteType.slice(1);
      typeText.fontSize = 24;
      typeText.fills = [{ type: 'SOLID', color: strokeColor }];
      typeText.textAutoResize = 'HEIGHT'; 

      detailsFrame.appendChild(typeText);

      // user name text
      const userText = figma.createText();
      userText.name = "From User";
      await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
      userText.fontName = { family: "DM Sans", style: "Medium" };
      userText.characters = `From ${username}`;
      userText.fontSize = 20;
      userText.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.06, b: 0.06 } }];
      userText.textAutoResize = 'HEIGHT'; 

      if (imageBytes) {
        userText.resize(200, userText.height); 
      } else {
        userText.resize(288, userText.height); 
      }

      detailsFrame.appendChild(userText);

      // Heading Frame
      const headingFrame = figma.createFrame();
      headingFrame.name = "Heading";
      headingFrame.layoutMode = 'HORIZONTAL';
      headingFrame.counterAxisSizingMode = 'AUTO'; 
      headingFrame.primaryAxisSizingMode = 'AUTO';
      headingFrame.itemSpacing = 16;
      headingFrame.primaryAxisAlignItems = 'CENTER';
      headingFrame.counterAxisAlignItems = 'MIN';
      headingFrame.resize(288, headingFrame.height); 
      headingFrame.fills = []; 

      headingFrame.appendChild(profileFrame);
      headingFrame.appendChild(detailsFrame);

      // the description/comment text
      const commentText = figma.createText();
      commentText.name = "Description";
      await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
      commentText.fontName = { family: "DM Sans", style: "Regular" };
      commentText.characters = comment;
      commentText.fontSize = 16;
      commentText.textAlignHorizontal = 'JUSTIFIED';
      commentText.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.06, b: 0.06 } }];
      commentText.layoutGrow = 1;
      commentText.resize(288, commentText.height); // Set width to 288 and height to hug contents

      noteFrame.appendChild(headingFrame);
      noteFrame.appendChild(commentText);

      currentPage.appendChild(noteFrame);
      noteFrame.x = figma.viewport.center.x;
      noteFrame.y = figma.viewport.center.y;
      figma.viewport.scrollAndZoomIntoView([noteFrame]);
    }
  } catch (error) {
    figma.notify("error, check log");
  }
};

//old code (for learning) that uses a pre made component in my figma file and simply creates an instance of that file
// figma.showUI(__html__, { width: 400, height: 300 });

// figma.ui.onmessage = async (msg) => {
//   try {
//     if (msg.type === 'create') {
//       const { comment, noteType, profileData } = msg;
//       const { imageBytes, username } = profileData;

//       const currentPage = figma.currentPage;
//       const noteComponent = currentPage.findOne(
//         (node) => node.name === "Note" && node.type === "COMPONENT"
//       ) as ComponentNode | null;

//       if (!noteComponent) {
//         figma.notify("Error: 'Note' component not found.");
//         return;
//       }

//       // create a note instance
//       const noteInstance = noteComponent.createInstance();

//       // find required nodes
//       const profilePictureFrame = noteInstance.findOne(
//         (node) => node.name === "Profile Picture" && node.type === "FRAME"
//       ) as FrameNode | null;

//       const headingFrame = noteInstance.findOne(
//         (node) => node.name === "Heading" && node.type === "FRAME"
//       ) as FrameNode | null;

//       const descriptionText = noteInstance.findOne(
//         (node) => node.name === "Description" && node.type === "TEXT"
//       ) as TextNode | null;

//       if (!profilePictureFrame || !headingFrame || !descriptionText) {
//         figma.notify("Error: Required frames or text nodes not found.");
//         return;
//       }

//       const detailsAutoLayout = headingFrame.findOne(
//         (node) => node.name === "Details" && node.type === "FRAME"
//       ) as FrameNode | null;

//       if (!detailsAutoLayout) {
//         figma.notify("Error: 'Details' auto layout not found inside 'Heading'.");
//         return;
//       }

//       // update text using user input

//       const typeText = detailsAutoLayout.findOne(
//         (node) => node.name === "Type of Note" && node.type === "TEXT"
//       ) as TextNode | null;

//       const userText = detailsAutoLayout.findOne(
//         (node) => node.name === "From User" && node.type === "TEXT"
//       ) as TextNode | null;

//       if (typeText && userText) {
//         await figma.loadFontAsync(typeText.fontName as FontName);
//         await figma.loadFontAsync(userText.fontName as FontName);

//         typeText.characters = noteType.charAt(0).toUpperCase() + noteType.slice(1);
//         if (noteType === "todo") {
//           typeText.fills = [{ type: 'SOLID', color: { r: 0.56, g: 0, b: 1 } }];
//         } else if (noteType === "update") {
//           typeText.fills = [{ type: 'SOLID', color: { r: 1, g: 0.71, b: 0.27 } }];
//         } else {
//           typeText.fills = [{ type: 'SOLID', color: { r: 0.13, g: 0.58, b: 0.95 } }];
//         }

//         userText.characters = `From ${username}`;
//       } else {
//         figma.notify("Error: 'Type of Note' or 'From User' text node not found.");
//         return;
//       }

//       await figma.loadFontAsync(descriptionText.fontName as FontName);
//       descriptionText.characters = comment;

//       // handle profile picture
//       const profilePictureNode = profilePictureFrame.findOne(
//         (node) => node.type === "RECTANGLE"
//       ) as RectangleNode | null;

//       if (profilePictureNode) {
//         if (imageBytes) {
//           const profilePictureImage = figma.createImage(new Uint8Array(imageBytes));
//           profilePictureNode.fills = [
//             { type: 'IMAGE', scaleMode: 'FILL', imageHash: profilePictureImage.hash },
//           ];
//         } else {
//           profilePictureFrame.visible = false; // Hide profile picture if no image
//         }
//       }

//       // handle border color change
//       if (noteType === "todo") {
//         noteInstance.strokes = [{ type: 'SOLID', color: { r: 0.56, g: 0, b: 1 } }];
//       } else if (noteType === "update") {
//         noteInstance.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.71, b: 0.27 } }];
//       } else {
//         noteInstance.strokes = [{ type: 'SOLID', color: { r: 0.13, g: 0.58, b: 0.95 } }];
//       }

//       // place the instance in the current page
//       currentPage.appendChild(noteInstance);
//       noteInstance.x = figma.viewport.center.x;
//       noteInstance.y = figma.viewport.center.y;
//       figma.viewport.scrollAndZoomIntoView([noteInstance]);

//       figma.notify("note created succesfully!");
//     }
//   } catch (error) {
//     figma.notify("unexpected error. check log files");
//   }
// };