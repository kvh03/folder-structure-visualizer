document.getElementById('folderInput').addEventListener('change', function(event) {
    const files = event.target.files;

    // Clear previous tree
    const projectTree = document.getElementById('projectTree');
    projectTree.innerHTML = '';

    const folderStructure = {};

    // Organize files into a tree structure
    for (const file of files) {
        const pathParts = file.webkitRelativePath.split('/');
        let currentLevel = folderStructure;

        pathParts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = index === pathParts.length - 1 ? null : {};
            }
            currentLevel = currentLevel[part];
        });
    }

    // Function to create tree nodes recursively
    function createTreeNodes(obj) {
        const ul = document.createElement('ul');
        for (const key in obj) {
            const li = document.createElement('li');
            li.textContent = key;

            if (obj[key] !== null) { // It's a folder
                li.classList.add('folder');
                li.appendChild(createTreeNodes(obj[key]));
            } else { // It's a file
                li.classList.add('file');
            }

            ul.appendChild(li);
        }
        return ul;
    }

    projectTree.appendChild(createTreeNodes(folderStructure));

    document.getElementById('copyButton').style.display = 'inline-block'; // Show button
});

document.getElementById('copyButton').addEventListener('click', function() {
    const projectTreeText = getTreeText(document.getElementById('projectTree'));
    
    navigator.clipboard.writeText(projectTreeText).then(() => {
        alert('Project structure copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

function getTreeText(ul, prefix = '', isLast = true) {
    let text = '';
    const children = Array.from(ul.children);

    children.forEach((li, index) => {
        const isLastChild = index === children.length - 1;
        const connector = isLast ? '    ' : '│   '; 
        const linePrefix = prefix + (isLastChild ? '    ' : '│   '); 
        
        const itemName = li.firstChild ? li.firstChild.textContent : '';

        text += prefix + (isLastChild ? '└─── ' : '├─── ') + itemName + '\n';
        
        const nestedUl = li.querySelector('ul');
        if (nestedUl) {
            text += getTreeText(nestedUl, linePrefix, isLastChild); 
        }
    });

    return text;
}