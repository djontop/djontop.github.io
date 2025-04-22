// Advanced code-themed animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all code animations
    initTerminalAnimation();
    initCodeRain();
    setupLanguageSwitcher();
});

// Terminal command execution animation
function initTerminalAnimation() {
    // Create terminal container
    const terminalContainer = document.createElement('div');
    terminalContainer.className = 'terminal-container';
    terminalContainer.innerHTML = `
        <div class="terminal-header">
            <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
            </div>
            <div class="terminal-title">Terminal</div>
        </div>
        <div class="terminal-body" id="terminal-body">
            <div class="terminal-line">
                <span class="terminal-prompt">user@djontop:~$</span>
                <span class="terminal-command" id="current-command"></span>
            </div>
        </div>
        <div class="terminal-controls">
            <div class="terminal-instruction">Press Enter or click button to execute</div>
            <button class="terminal-button" id="execute-btn">Execute Command</button>
        </div>
    `;
    
    // Insert the terminal after the hero section
    const repoSection = document.querySelector('#repositories');
    if (repoSection && repoSection.parentNode) {
        repoSection.parentNode.insertBefore(terminalContainer, repoSection);
    }
    
    // Get terminal body for appending content
    const terminalBody = terminalContainer.querySelector('#terminal-body');
    let currentCommandElement = terminalContainer.querySelector('#current-command');
    
    // Define commands and outputs
    const commands = [
        {
            cmd: 'ls -la',
            output: 'total 48\ndrwxr-xr-x  7 djontop  staff   224 May 18 14:32 .\ndrwxr-xr-x  3 djontop  staff    96 May 18 10:15 ..\ndrwxr-xr-x 12 djontop  staff   384 May 18 14:27 .git\n-rw-r--r--  1 djontop  staff   238 May 18 10:18 .gitignore\n-rw-r--r--  1 djontop  staff  1256 May 18 10:22 README.md\ndrwxr-xr-x  5 djontop  staff   160 May 18 13:45 data\ndrwxr-xr-x  4 djontop  staff   128 May 18 11:30 models\n-rw-r--r--  1 djontop  staff   856 May 18 10:28 requirements.txt\ndrwxr-xr-x  8 djontop  staff   256 May 18 14:32 src\ndrwxr-xr-x  4 djontop  staff   128 May 18 12:15 tests'
        },
        {
            cmd: 'cat requirements.txt',
            output: 'tensorflow==2.10.0\nnumpy==1.23.5\npandas==1.5.2\nscikit-learn==1.2.0\ntransformers==4.25.1\ntorch==2.0.1\ntorchvision==0.15.2\ntqdm==4.65.0\nmatplotlib==3.7.1\nseaborn==0.12.2\nopencv-python==4.7.0.72\nflask==2.3.2\ngdown==4.7.1\npillow==9.5.0\nrequests==2.31.0'
        },
        {
            cmd: 'python --version',
            output: 'Python 3.11.4'
        },
        {
            cmd: 'git status',
            output: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n\t modified:   src/model.py\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tsrc/preprocess_v2.py\n\nno changes added to commit (use "git add" and/or "git commit -a")'
        },
        {
            cmd: 'git clone https://github.com/djontop/ai-project.git',
            output: 'Cloning into \'ai-project\'...\nremote: Enumerating objects: 247, done.\nremote: Counting objects: 100% (247/247), done.\nremote: Compressing objects: 100% (153/153), done.\nremote: Total 247 (delta 94), reused 221 (delta 78)\nReceiving objects: 100% (247/247), 28.59 MiB | 10.32 MiB/s, done.\nResolving deltas: 100% (94/94), done.'
        },
        {
            cmd: 'cd ai-project && ls -l',
            output: 'total 36\n-rw-r--r-- 1 djontop staff  1256 May 18 14:32 README.md\ndrwxr-xr-x 5 djontop staff   160 May 18 14:32 data\ndrwxr-xr-x 4 djontop staff   128 May 18 14:32 models\n-rw-r--r-- 1 djontop staff   856 May 18 14:32 requirements.txt\ndrwxr-xr-x 8 djontop staff   256 May 18 14:32 src\ndrwxr-xr-x 4 djontop staff   128 May 18 14:32 tests'
        },
        {
            cmd: 'cat README.md | head -n 10',
            output: '# Generative AI Project\n\nThis repository contains code for a state-of-the-art generative AI model that combines transformer architecture with reinforcement learning from human feedback.\n\n## Features\n- Multi-modal input processing (text, images)\n- Fine-tuning capabilities on domain-specific data\n- Custom evaluation metrics\n- Optimized inference for production deployment\n- Comprehensive test suite'
        },
        {
            cmd: 'pip install -r requirements.txt',
            output: 'Collecting tensorflow==2.10.0\n  Downloading tensorflow-2.10.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (578.0 MB)\n     |████████████████████████████████| 578.0 MB 9.7 MB/s \nCollecting numpy==1.23.5\n  Downloading numpy-1.23.5-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (17.1 MB)\n     |████████████████████████████████| 17.1 MB 42.3 MB/s\nCollecting pandas==1.5.2\n  Downloading pandas-1.5.2-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (12.2 MB)\n     |████████████████████████████████| 12.2 MB 39.7 MB/s\nCollecting scikit-learn==1.2.0\n  Downloading scikit_learn-1.2.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (9.6 MB)\n     |████████████████████████████████| 9.6 MB 40.1 MB/s\nCollecting transformers==4.25.1\n  Downloading transformers-4.25.1-py3-none-any.whl (5.8 MB)\n     |████████████████████████████████| 5.8 MB 28.5 MB/s\nCollecting torch==2.0.1\n  Downloading torch-2.0.1-cp311-cp311-manylinux1_x86_64.whl (619.9 MB)\n     |████████████████████████████████| 619.9 MB 7.8 MB/s\n[... more packages ...]\nInstalling collected packages: numpy, tqdm, six, pillow, pyyaml, packaging, urllib3, idna, certifi, charset-normalizer, requests, pyparsing, python-dateutil, contourpy, fonttools, cycler, kiwisolver, matplotlib, pandas, joblib, threadpoolctl, scikit-learn, typing-extensions, nvidia-cudnn-cu11, nvidia-cublas-cu11, nvidia-cuda-runtime-cu11, nvidia-cuda-cupti-cu11, nvidia-cuda-nvrtc-cu11, nvidia-nvtx-cu11, nvidia-nccl-cu11, sympy, networkx, jinja2, nvidia-cufft-cu11, nvidia-curand-cu11, nvidia-cusolver-cu11, nvidia-cusparse-cu11, nvidia-nccl-cu11, nvidia-nvjitlink-cu11, torch, torchvision, seaborn, opencv-python, itsdangerous, click, werkzeug, flask, filelock, regex, tokenizers, huggingface-hub, transformers, tensorflow, gdown\nSuccessfully installed tensorflow-2.10.0 numpy-1.23.5 pandas-1.5.2 scikit-learn-1.2.0 transformers-4.25.1 torch-2.0.1 [... and more ...]'
        },
        {
            cmd: 'cd src && ls -l',
            output: 'total 56\n-rw-r--r-- 1 djontop staff  3452 May 18 14:32 __init__.py\n-rw-r--r-- 1 djontop staff  5120 May 18 14:32 config.py\n-rw-r--r-- 1 djontop staff  8756 May 18 14:32 data_loader.py\n-rw-r--r-- 1 djontop staff  7224 May 18 14:32 evaluate.py\n-rw-r--r-- 1 djontop staff 10254 May 18 14:32 model.py\n-rw-r--r-- 1 djontop staff  6782 May 18 14:32 preprocess.py\n-rw-r--r-- 1 djontop staff  2345 May 18 14:32 preprocess_v2.py\n-rw-r--r-- 1 djontop staff  4328 May 18 14:32 train.py\n-rw-r--r-- 1 djontop staff  3652 May 18 14:32 utils.py'
        },
        {
            cmd: 'python train.py --config ../config/model_v2.yaml --epochs 200',
            output: 'Loading configuration from ../config/model_v2.yaml\nConfiguration loaded successfully\n\nInitializing data loaders...\n100%|██████████| 24586/24586 [00:35<00:00, 693.21it/s]\nProcessing training data: 100%|██████████| 18440/18440 [01:12<00:00, 254.23it/s]\nProcessing validation data: 100%|██████████| 6146/6146 [00:24<00:00, 254.82it/s]\n\nBuilding model architecture...\n - Initializing transformer encoder with 12 layers\n - Setting up multi-head attention with 16 heads\n - Configuring embedding dimension: 768\n - Dropout rate: 0.1\n - Initializing weights using truncated normal distribution\n\nStarting training for 200 epochs:\nEpoch 1/200: 100%|██████████| 577/577 [02:35<00:00, 3.71it/s, loss=4.123, val_loss=3.842]\nEpoch 2/200: 100%|██████████| 577/577 [02:33<00:00, 3.76it/s, loss=3.256, val_loss=3.127]\nEpoch 3/200: 100%|██████████| 577/577 [02:34<00:00, 3.73it/s, loss=2.845, val_loss=2.762]\n...\nEpoch 198/200: 100%|██████████| 577/577 [02:32<00:00, 3.79it/s, loss=0.218, val_loss=0.456]\nEpoch 199/200: 100%|██████████| 577/577 [02:33<00:00, 3.77it/s, loss=0.212, val_loss=0.452]\nEpoch 200/200: 100%|██████████| 577/577 [02:34<00:00, 3.75it/s, loss=0.207, val_loss=0.448]\n\nTraining completed.\n\nFinal metrics:\n - Training loss: 0.207\n - Validation loss: 0.448\n - Validation accuracy: 95.8%\n - F1 score: 0.945\n\nSaving model to ../models/model_v2.h5\nModel saved successfully.\n\nGenerating training report...\nReport saved to ../reports/training_report_v2.pdf'
        },
        {
            cmd: 'python evaluate.py --model ../models/model_v2.h5 --test-data ../data/test',
            output: 'Loading model from ../models/model_v2.h5\nModel loaded successfully.\n\nLoading test data from ../data/test\nProcessing test data: 100%|██████████| 3245/3245 [00:15<00:00, 213.56it/s]\n\nEvaluating model performance:\nRunning evaluation: 100%|██████████| 102/102 [00:45<00:00, 2.26it/s]\n\nTest Results:\n - Test loss: 0.467\n - Test accuracy: 94.3%\n - Precision: 0.937\n - Recall: 0.951\n - F1 score: 0.944\n\nConfusion Matrix:\n[[856   7  12   3]\n [  5 792  13   8]\n [ 10  15 745   9]\n [  4   6  11 759]]\n\nDetailed classification report saved to ../reports/evaluation_report_v2.json\nGenerating visualizations...\nPlots saved to ../reports/figures/'
        },
        {
            cmd: 'git add src/*.py',
            output: ''
        },
        {
            cmd: 'git commit -m "Improve model performance with optimized preprocessing"',
            output: '[main a42f8d7] Improve model performance with optimized preprocessing\n 2 files changed, 167 insertions(+), 43 deletions(-)'
        },
        {
            cmd: 'git push origin main',
            output: 'Enumerating objects: 9, done.\nCounting objects: 100% (9/9), done.\nDelta compression using up to 12 threads\nCompressing objects: 100% (5/5), done.\nWriting objects: 100% (5/5), 1.22 KiB | 1.22 MiB/s, done.\nTotal 5 (delta 3), reused 0 (delta 0), pack-reused 0\nremote: Resolving deltas: 100% (3/3), completed with 3 local objects.\nTo https://github.com/djontop/ai-project.git\n   f8d92e5..a42f8d7  main -> main'
        }
    ];
    
    let currentCommandIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    let terminalActive = false;
    
    // Add styles for the instruction text and button
    const style = document.createElement('style');
    style.textContent = `
        .terminal-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .terminal-instruction {
            text-align: center;
            color: #aaa;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .terminal-button {
            background-color: #8c00ff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        
        .terminal-button:hover {
            background-color: #a030ff;
        }
        
        .terminal-button:active {
            transform: translateY(1px);
        }
        
        .terminal-container.active .terminal-instruction {
            color: #50fa7b;
        }
        
        @media (max-width: 768px) {
            .terminal-controls {
                padding: 12px;
            }
            
            .terminal-button {
                padding: 10px 20px;
                font-size: 16px;
                width: 80%;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Start the terminal animation when terminal becomes visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !terminalActive) {
            terminalActive = true;
            terminalContainer.classList.add('active');
            
            // Add event listener for key press
            document.addEventListener('keydown', handleKeyPress);
            
            // Add event listener for button click
            const executeBtn = document.getElementById('execute-btn');
            if (executeBtn) {
                executeBtn.addEventListener('click', () => {
                    if (!isTyping) {
                        typeCommand();
                    }
                });
            }
        }
    }, { threshold: 0.2 });
    
    observer.observe(terminalContainer);
    
    // Handle key press
    function handleKeyPress(e) {
        // Only proceed if terminal is active and not currently typing
        if (terminalActive && !isTyping) {
            // Enter key or space bar
            if (e.key === 'Enter' || e.key === ' ') {
                typeCommand();
            }
        }
    }
    
    // Main function to run commands in sequence
    function runNextCommand() {
        if (currentCommandIndex >= commands.length) {
            // All commands executed, remove event listener
            document.removeEventListener('keydown', handleKeyPress);
            return;
        }
        
        // Reset character index for new command
        charIndex = 0;
    }
    
    // Type command character by character
    function typeCommand() {
        if (currentCommandIndex >= commands.length) {
            return; // All commands executed
        }
        
        isTyping = true;
        
        // Disable the button while typing
        const executeBtn = document.getElementById('execute-btn');
        if (executeBtn) {
            executeBtn.textContent = 'Typing...';
            executeBtn.disabled = true;
        }
        
        const currentCommand = commands[currentCommandIndex].cmd;
        
        // Set interval to type characters
        const typingInterval = setInterval(() => {
            if (charIndex < currentCommand.length) {
                // Add next character to command
                currentCommandElement.textContent += currentCommand[charIndex];
                charIndex++;
            } else {
                // Command is fully typed
                clearInterval(typingInterval);
                setTimeout(showOutput, 500);
            }
        }, 30);
    }
    
    // Show command output
    function showOutput() {
        // Create output element
        const outputElement = document.createElement('div');
        outputElement.className = 'output-text';
        
        // Format the output (replace newlines with <br>)
        const output = commands[currentCommandIndex].output;
        const formattedOutput = output.replace(/\n/g, '<br>');
        outputElement.innerHTML = formattedOutput;
        
        // Add the output to the terminal body
        terminalBody.appendChild(outputElement);
        
        // Move to next command after a pause
        setTimeout(prepareNextCommand, 1000);
    }
    
    // Prepare for the next command
    function prepareNextCommand() {
        // Move to the next command
        currentCommandIndex++;
        
        // If we have more commands to execute
        if (currentCommandIndex < commands.length) {
            // Create a new command line
            const newCommandLine = document.createElement('div');
            newCommandLine.className = 'terminal-line';
            newCommandLine.innerHTML = `
                <span class="terminal-prompt">user@djontop:~$</span>
                <span class="terminal-command" id="command-${currentCommandIndex}"></span>
            `;
            
            // Add the new command line to the terminal
            terminalBody.appendChild(newCommandLine);
            
            // Update the current command element
            currentCommandElement = terminalBody.querySelector(`#command-${currentCommandIndex}`);
            
            // Scroll terminal to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
            
            // Enable the button for the next command
            const executeBtn = document.getElementById('execute-btn');
            if (executeBtn) {
                executeBtn.textContent = 'Execute Command';
                executeBtn.disabled = false;
            }
            
            // Ready for next command, no longer typing
            isTyping = false;
        } else {
            // All commands completed
            const completionMessage = document.createElement('div');
            completionMessage.className = 'terminal-line';
            completionMessage.innerHTML = `
                <span class="terminal-prompt">user@djontop:~$</span>
                <span class="terminal-message" style="color: #50fa7b;">All commands completed!</span>
            `;
            terminalBody.appendChild(completionMessage);
            
            // Update instruction text and button
            const instruction = terminalContainer.querySelector('.terminal-instruction');
            if (instruction) {
                instruction.textContent = 'Terminal session finished';
            }
            
            const executeBtn = document.getElementById('execute-btn');
            if (executeBtn) {
                executeBtn.textContent = 'Session Completed';
                executeBtn.disabled = true;
                executeBtn.style.backgroundColor = '#555';
            }
        }
    }
}

// Matrix-style code rain effect
function initCodeRain() {
    // Create canvas container
    const rainContainer = document.createElement('div');
    rainContainer.className = 'code-rain-container';
    
    // Create canvas
    const canvas = document.createElement('canvas');
    rainContainer.appendChild(canvas);
    
    // Add to the page (after hero section but before terminal)
    const heroSection = document.querySelector('#home');
    if (heroSection && heroSection.nextElementSibling) {
        heroSection.parentNode.insertBefore(rainContainer, heroSection.nextElementSibling);
    }
    
    // Add title overlay
    const titleOverlay = document.createElement('div');
    titleOverlay.className = 'rain-title';
    titleOverlay.innerHTML = '<h2>Code is <span class="highlight">Poetry</span></h2>';
    rainContainer.appendChild(titleOverlay);
    
    // Canvas setup
    const ctx = canvas.getContext('2d');
    canvas.width = rainContainer.offsetWidth;
    canvas.height = 300; // Fixed height
    
    // Characters for the matrix rain (mix of letters, numbers, and symbols)
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!|\\{}[]<>^~`';
    const columns = Math.floor(canvas.width / 20); // Each character takes about 20px width
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    // Matrix rain drawing function
    function drawRain() {
        // Semi-transparent black background to create trailing effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the color and font for the characters
        ctx.fillStyle = '#0f0'; // Bright green
        ctx.font = '15px monospace';
        
        // Loop through each drop
        for (let i = 0; i < drops.length; i++) {
            // Choose a random character
            const char = characters[Math.floor(Math.random() * characters.length)];
            
            // Calculate x position (column)
            const x = i * 20;
            
            // Calculate y position (row)
            const y = drops[i] * 20;
            
            // Draw the character
            ctx.fillText(char, x, y);
            
            // If the drop has reached the bottom or randomly reset some drops
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Move the drop down
            drops[i]++;
        }
    }
    
    // Start the animation
    setInterval(drawRain, 50);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = rainContainer.offsetWidth;
        
        // Recalculate columns and reset drops
        const newColumns = Math.floor(canvas.width / 20);
        
        // Reset drop positions
        for (let i = 0; i < newColumns; i++) {
            drops[i] = drops[i] || 1;
        }
    });
}

// Multiple language code typing animation
function setupLanguageSwitcher() {
    // Only proceed if we have the code window
    const codeWindow = document.querySelector('.code-window');
    if (!codeWindow) return;
    
    // Create language switcher
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    
    // Add language options
    const languages = [
        { name: 'Python', class: 'language-python', active: true },
        { name: 'JavaScript', class: 'language-javascript' },
        { name: 'C++', class: 'language-cpp' },
        { name: 'Java', class: 'language-java' }
    ];
    
    // Create buttons for each language
    languages.forEach(lang => {
        const button = document.createElement('button');
        button.className = lang.active ? 'active' : '';
        button.textContent = lang.name;
        button.addEventListener('click', () => switchLanguage(lang.name));
        languageSwitcher.appendChild(button);
    });
    
    // Insert the language switcher above the code window
    codeWindow.parentNode.insertBefore(languageSwitcher, codeWindow);
    
    // Code snippets for different languages
    const codeSnippets = {
        'Python': `# Manthan Vasant (DJ On Top)
class Developer:
    def __init__(self):
        self.name = "Manthan Vasant"
        self.alias = "DJ On Top"
        self.skills = ["Generative AI", "AI", "Python", "Machine Learning", 
                      "FiveM", "QBCore", "Lua"]
        self.education = "B.Tech in AI and Data Science"
        self.passion = "Creating AI solutions & awesome scripts"
        self.github = "https://github.com/djontop"
    
    def connect(self):
        return self.github

# Ready to collaborate?
developer = Developer()
developer.connect()`,
        'JavaScript': `// Manthan Vasant (DJ On Top)
class Developer {
  constructor() {
    this.name = "Manthan Vasant";
    this.alias = "DJ On Top";
    this.skills = ["Generative AI", "AI", "Python", "Machine Learning", 
                  "FiveM", "QBCore", "Lua"];
    this.education = "B.Tech in AI and Data Science";
    this.passion = "Creating AI solutions & awesome scripts";
    this.github = "https://github.com/djontop";
  }
  
  connect() {
    return this.github;
  }
}

// Ready to collaborate?
const developer = new Developer();
developer.connect();`,
        'C++': `// Manthan Vasant (DJ On Top)
#include <iostream>
#include <vector>
#include <string>

class Developer {
private:
    std::string name;
    std::string alias;
    std::vector<std::string> skills;
    std::string education;
    std::string passion;
    std::string github;

public:
    Developer() : 
        name("Manthan Vasant"),
        alias("DJ On Top"),
        education("B.Tech in AI and Data Science"),
        passion("Creating AI solutions & awesome scripts"),
        github("https://github.com/djontop")
    {
        skills = {"Generative AI", "AI", "Python", "Machine Learning", 
                 "FiveM", "QBCore", "Lua"};
    }
    
    std::string connect() {
        return github;
    }
};

// Ready to collaborate?
int main() {
    Developer developer;
    std::cout << developer.connect() << std::endl;
    return 0;
}`,
        'Java': `// Manthan Vasant (DJ On Top)
import java.util.Arrays;
import java.util.List;

public class Developer {
    private String name;
    private String alias;
    private List<String> skills;
    private String education;
    private String passion;
    private String github;
    
    public Developer() {
        this.name = "Manthan Vasant";
        this.alias = "DJ On Top";
        this.skills = Arrays.asList("Generative AI", "AI", "Python", "Machine Learning", 
                                  "FiveM", "QBCore", "Lua");
        this.education = "B.Tech in AI and Data Science";
        this.passion = "Creating AI solutions & awesome scripts";
        this.github = "https://github.com/djontop";
    }
    
    public String connect() {
        return github;
    }
    
    // Ready to collaborate?
    public static void main(String[] args) {
        Developer developer = new Developer();
        System.out.println(developer.connect());
    }
}`
    };
    
    // Function to switch language
    function switchLanguage(language) {
        // Update active button
        const buttons = languageSwitcher.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.className = btn.textContent === language ? 'active' : '';
        });
        
        // Get the code element
        const codeElement = codeWindow.querySelector('code');
        if (!codeElement) return;
        
        // Update class for proper syntax highlighting
        codeElement.className = languages.find(l => l.name === language).class;
        
        // Update code content
        codeElement.textContent = codeSnippets[language];
        
        // Remove any previous cursor-blink class
        codeElement.classList.remove('cursor-blink');
        
        // Make sure it's visible
        codeElement.style.visibility = 'visible';
        
        // Apply syntax highlighting based on language
        if (language === 'Python') {
            // We already have this in the main animation.js
            if (window.syntaxHighlight) {
                window.syntaxHighlight(codeElement);
            }
        } else {
            // Apply language-specific highlighting
            highlightSyntax(codeElement, language);
        }
    }
    
    // Syntax highlighting for other languages
    function highlightSyntax(element, language) {
        // Create a temporary container
        const tempContainer = document.createElement('div');
        const content = element.textContent;
        
        // Process based on language
        switch(language) {
            case 'JavaScript':
                highlightJavaScript(content, tempContainer);
                break;
            case 'C++':
                highlightCpp(content, tempContainer);
                break;
            case 'Java':
                highlightJava(content, tempContainer);
                break;
        }
        
        // Apply the highlighted content
        element.innerHTML = '';
        Array.from(tempContainer.childNodes).forEach(node => {
            element.appendChild(node.cloneNode(true));
        });
    }
    
    // JavaScript highlighting
    function highlightJavaScript(code, container) {
        const lines = code.split('\n');
        
        // Define keywords and special elements
        const keywords = ['class', 'constructor', 'function', 'const', 'let', 'var', 'return', 'this', 'new', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'static'];
        
        lines.forEach(line => {
            const lineDiv = document.createElement('div');
            
            // Handle comments
            if (line.trim().startsWith('//')) {
                const span = document.createElement('span');
                span.className = 'py-comment'; // Reuse Python comment style
                span.textContent = line;
                lineDiv.appendChild(span);
                container.appendChild(lineDiv);
                return;
            }
            
            // Tokenize the line
            let tokens = [];
            let currentToken = '';
            let inString = false;
            let stringChar = '';
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                // Handle strings
                if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
                    if (!inString) {
                        if (currentToken) {
                            tokens.push(currentToken);
                            currentToken = '';
                        }
                        inString = true;
                        stringChar = char;
                        currentToken = char;
                    } else if (char === stringChar) {
                        currentToken += char;
                        tokens.push(currentToken);
                        currentToken = '';
                        inString = false;
                    } else {
                        currentToken += char;
                    }
                } else if (inString) {
                    currentToken += char;
                } else if (/\s/.test(char)) {
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    tokens.push(char);
                } else if (/[^\w\.]/.test(char)) {
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    tokens.push(char);
                } else {
                    currentToken += char;
                }
            }
            
            if (currentToken) {
                tokens.push(currentToken);
            }
            
            // Process tokens
            tokens.forEach(token => {
                const span = document.createElement('span');
                
                if (keywords.includes(token)) {
                    span.className = 'py-keyword'; // Reuse Python keyword style
                } else if (token.startsWith('"') || token.startsWith("'")) {
                    span.className = 'py-string'; // Reuse Python string style
                } else if (/^\d+$/.test(token)) {
                    span.className = 'py-number'; // Reuse Python number style
                } else if (token === 'Developer') {
                    span.className = 'py-class'; // Reuse Python class style
                } else if (token === 'connect') {
                    span.className = 'py-function'; // Reuse Python function style
                }
                
                span.textContent = token;
                lineDiv.appendChild(span);
            });
            
            container.appendChild(lineDiv);
        });
    }
    
    // C++ highlighting
    function highlightCpp(code, container) {
        const lines = code.split('\n');
        
        // Define keywords and special elements
        const keywords = ['class', 'private', 'public', 'protected', 'return', 'using', 'namespace', 
                        'if', 'else', 'for', 'while', 'int', 'float', 'double', 'char', 'void', 
                        'bool', 'string', 'vector', 'static', 'const', 'include', 'std'];
        
        lines.forEach(line => {
            const lineDiv = document.createElement('div');
            
            // Handle comments
            if (line.trim().startsWith('//')) {
                const span = document.createElement('span');
                span.className = 'py-comment';
                span.textContent = line;
                lineDiv.appendChild(span);
                container.appendChild(lineDiv);
                return;
            }
            
            // Handle preprocessor directives
            if (line.trim().startsWith('#')) {
                const span = document.createElement('span');
                span.className = 'py-keyword';
                span.textContent = line;
                lineDiv.appendChild(span);
                container.appendChild(lineDiv);
                return;
            }
            
            // Tokenize the line
            let tokens = [];
            let currentToken = '';
            let inString = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                // Handle strings
                if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                    if (!inString) {
                        if (currentToken) {
                            tokens.push(currentToken);
                            currentToken = '';
                        }
                        inString = true;
                        currentToken = char;
                    } else {
                        currentToken += char;
                        tokens.push(currentToken);
                        currentToken = '';
                        inString = false;
                    }
                } else if (inString) {
                    currentToken += char;
                } else if (/\s/.test(char)) {
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    tokens.push(char);
                } else if (/[^\w\:\_]/.test(char)) {
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    tokens.push(char);
                } else {
                    currentToken += char;
                }
            }
            
            if (currentToken) {
                tokens.push(currentToken);
            }
            
            // Process tokens
            tokens.forEach(token => {
                const span = document.createElement('span');
                
                if (keywords.includes(token)) {
                    span.className = 'py-keyword';
                } else if (token.startsWith('"')) {
                    span.className = 'py-string';
                } else if (/^\d+$/.test(token)) {
                    span.className = 'py-number';
                } else if (token === 'Developer') {
                    span.className = 'py-class';
                } else if (token === 'connect' || token === 'main') {
                    span.className = 'py-function';
                } else if (token.includes('std::')) {
                    span.className = 'py-keyword';
                }
                
                span.textContent = token;
                lineDiv.appendChild(span);
            });
            
            container.appendChild(lineDiv);
        });
    }
    
    // Java highlighting
    function highlightJava(code, container) {
        const lines = code.split('\n');
        
        // Define keywords and special elements
        const keywords = ['public', 'private', 'protected', 'class', 'static', 'void', 'return', 
                        'import', 'new', 'this', 'if', 'else', 'for', 'while', 'int', 'String',
                        'boolean', 'final', 'extends', 'implements', 'interface'];
        
        lines.forEach(line => {
            const lineDiv = document.createElement('div');
            
            // Handle comments
            if (line.trim().startsWith('//')) {
                const span = document.createElement('span');
                span.className = 'py-comment';
                span.textContent = line;
                lineDiv.appendChild(span);
                container.appendChild(lineDiv);
                return;
            }
            
            // Tokenize the line
            let tokens = [];
            let currentToken = '';
            let inString = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                // Handle strings
                if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                    if (!inString) {
                        if (currentToken) {
                            tokens.push(currentToken);
                            currentToken = '';
                        }
                        inString = true;
                        currentToken = char;
                    } else {
                        currentToken += char;
                        tokens.push(currentToken);
                        currentToken = '';
                        inString = false;
                    }
                } else if (inString) {
                    currentToken += char;
                } else if (/\s/.test(char)) {
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    tokens.push(char);
                } else if (/[^\w\.]/.test(char)) {
                    if (currentToken) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                    tokens.push(char);
                } else {
                    currentToken += char;
                }
            }
            
            if (currentToken) {
                tokens.push(currentToken);
            }
            
            // Process tokens
            tokens.forEach(token => {
                const span = document.createElement('span');
                
                if (keywords.includes(token)) {
                    span.className = 'py-keyword';
                } else if (token.startsWith('"')) {
                    span.className = 'py-string';
                } else if (/^\d+$/.test(token)) {
                    span.className = 'py-number';
                } else if (token === 'Developer' || token === 'List' || token === 'Arrays') {
                    span.className = 'py-class';
                } else if (token === 'connect' || token === 'main' || token === 'println' || token === 'asList') {
                    span.className = 'py-function';
                } else if (token === 'System' || token === 'out') {
                    span.className = 'py-self';
                }
                
                span.textContent = token;
                lineDiv.appendChild(span);
            });
            
            container.appendChild(lineDiv);
        });
    }
} 