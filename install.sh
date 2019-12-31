#!/bin/sh

LF=$(printf '\\\012_')
LF=${LF%_}

mkdir -p node_modules/scratch-vm/src/extensions/scratch3_ml2scratch
wget -P node_modules/scratch-vm/src/extensions/scratch3_ml2scratch https://raw.githubusercontent.com/champierre/ml2scratch/master/scratch-vm/src/extensions/scratch3_ml2scratch/index.js
wget -P node_modules/scratch-vm/src/extensions/scratch3_ml2scratch https://unpkg.com/ml5@0.3.1/dist/ml5.min.js
mv node_modules/scratch-vm/src/extension-support/extension-manager.js node_modules/scratch-vm/src/extension-support/extension-manager.js_orig
sed -e "s|scratch3_gdx_for')$|scratch3_gdx_for'),${LF}    ml2scratch: () => require('../extensions/scratch3_ml2scratch')|g" node_modules/scratch-vm/src/extension-support/extension-manager.js_orig > node_modules/scratch-vm/src/extension-support/extension-manager.js

mkdir -p src/lib/libraries/extensions/ml2scratch
wget -P src/lib/libraries/extensions/ml2scratch https://raw.githubusercontent.com/champierre/ml2scratch/master/scratch-gui/src/lib/libraries/extensions/ml2scratch/ml2scratch.png
wget -P src/lib/libraries/extensions/ml2scratch https://raw.githubusercontent.com/champierre/ml2scratch/master/scratch-gui/src/lib/libraries/extensions/ml2scratch/ml2scratch-small.png
mv src/lib/libraries/extensions/index.jsx src/lib/libraries/extensions/index.jsx_orig
ML2SCRATCH="\
    {${LF}\
        name: 'ML2Scratch',${LF}\
        extensionId: 'ml2scratch',${LF}\
        collaborator: 'champierre',${LF}\
        iconURL: ml2scratchIconURL,${LF}\
        insetIconURL: ml2scratchInsetIconURL,${LF}\
        description: (${LF}\
            <FormattedMessage${LF}\
                defaultMessage='ML2Scratch Blocks.'${LF}\
                description='ML2Scratch Blocks'${LF}\
                id='gui.extension.ml2scratchblocks.description'${LF}\
            />${LF}\
        ),${LF}\
        featured: true,${LF}\
        disabled: false,${LF}\
        internetConnectionRequired: true,${LF}\
        bluetoothRequired: false,${LF}\
        helpLink: 'https://champierre.github.io/ml2scratch/'${LF}\
    },"
sed -e "s|^export default \[$|import ml2scratchIconURL from './ml2scratch/ml2scratch.png';${LF}import ml2scratchInsetIconURL from './ml2scratch/ml2scratch-small.png';${LF}${LF}export default [${LF}${ML2SCRATCH}|g" src/lib/libraries/extensions/index.jsx_orig > src/lib/libraries/extensions/index.jsx
