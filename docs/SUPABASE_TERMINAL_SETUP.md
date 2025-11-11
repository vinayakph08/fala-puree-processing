# 🚀 Supabase CLI Terminal Completion & Alias Setup Guide

Complete setup guide for **Supabase CLI** with shell completion and useful aliases for **Zsh** and **Oh-My-Zsh** terminals.

---

## 📋 **What You'll Get**

- **Tab completion** for all Supabase commands and flags
- **Useful aliases** to speed up your workflow
- **Auto-suggestions** and **error prevention**
- **Command discovery** for exploring new features

---

## 🛠 **Setup for Zsh (Default macOS Terminal)**

### **1. Generate and Install Completion**

```bash
# Create completion script
supabase completion zsh > ~/.supabase-completion.zsh

# Add to your .zshrc file
echo 'source ~/.supabase-completion.zsh' >> ~/.zshrc

# Reload your shell
source ~/.zshrc
```

### **2. Add Useful Aliases**

```bash
# Add aliases to .zshrc
cat >> ~/.zshrc << 'EOF'

# Supabase aliases
alias sp="supabase"
alias spm="supabase migration"
alias spdb="supabase db"
alias spfn="supabase functions"
alias spst="supabase status"

# Enable completion for aliases
compdef sp=supabase
compdef spm='supabase migration'
compdef spdb='supabase db'
compdef spfn='supabase functions'
compdef spst='supabase status'

EOF

# Reload shell
source ~/.zshrc
```

---

## 🎨 **Setup for Oh-My-Zsh**

### **Method 1: Custom Plugin (Recommended)**

```bash
# Create plugin directory
mkdir -p ~/.oh-my-zsh/custom/plugins/supabase

# Generate completion file
supabase completion zsh > ~/.oh-my-zsh/custom/plugins/supabase/_supabase

# Create plugin file
cat > ~/.oh-my-zsh/custom/plugins/supabase/supabase.plugin.zsh << 'EOF'
# Supabase Plugin for Oh-My-Zsh

# Aliases
alias sp="supabase"
alias spm="supabase migration"
alias spdb="supabase db"
alias spfn="supabase functions"
alias spst="supabase status"

# Enable completion for aliases
compdef sp=supabase
compdef spm='supabase migration'
compdef spdb='supabase db'
compdef spfn='supabase functions'
compdef spst='supabase status'
EOF
```

### **Edit your .zshrc to include the plugin:**

```bash
# Open .zshrc
nano ~/.zshrc

# Find the plugins line and add 'supabase'
plugins=(git supabase)

# Reload shell
source ~/.zshrc
```

### **Method 2: Direct Addition to .zshrc**

```bash
# Add completion and aliases to .zshrc
cat >> ~/.zshrc << 'EOF'

# Supabase completion
source <(supabase completion zsh)

# Supabase aliases
alias sp="supabase"
alias spm="supabase migration"
alias spdb="supabase db"
alias spfn="supabase functions"
alias spst="supabase status"

# Enable completion for aliases
compdef sp=supabase
compdef spm='supabase migration'
compdef spdb='supabase db'
compdef spfn='supabase functions'
compdef spst='supabase status'

EOF

# Reload shell
source ~/.zshrc
```

---

## ✨ **Testing Your Setup**

### **Test Tab Completion**

```bash
# Test basic completion
sp[TAB]  # Should complete to 'supabase'

# Test nested completion
sp mig[TAB]  # Should complete to 'migration'
sp db [TAB][TAB]  # Shows: diff, dump, push, pull, reset, etc.

# Test flag completion
sp db push --[TAB][TAB]  # Shows: --confirm, --include-seed, --dry-run, --help
```

### **Test Aliases**

```bash
# Test aliases work
sp status           # Same as: supabase status
spm list           # Same as: supabase migration list
spdb reset         # Same as: supabase db reset
spfn list          # Same as: supabase functions list
```

---

## 🚀 **Benefits in Action**

### **1. Faster Command Entry**

```bash
# Without completion/aliases (40+ keystrokes)
supabase migration new add_user_profile_table

# With completion/aliases (15+ keystrokes + TAB)
spm[TAB] new[TAB] add_user[TAB]
```

### **2. Command Discovery**

```bash
# Discover available commands
sp [TAB][TAB]
# Shows: db, functions, migration, link, start, stop, status, etc.

# Explore database commands
spdb [TAB][TAB]
# Shows: diff, dump, push, pull, reset, start, stop, inspect, etc.
```

### **3. Flag Discovery**

```bash
# See all available flags
spm up --[TAB][TAB]
# Shows: --debug, --target, --help, etc.

spdb push --[TAB][TAB]
# Shows: --confirm, --include-seed, --dry-run, --help, etc.
```

### **4. Error Prevention**

```bash
# Prevents typos in critical commands
spdb push --confirm   # ✅ Correct (with completion)
supabase db psuh      # ❌ Typo without completion
```

---

## 🔧 **Advanced Configuration**

### **Add More Specific Aliases**

```bash
# Add to your .zshrc for more granular shortcuts
cat >> ~/.zshrc << 'EOF'

# Database-specific aliases
alias spdr="supabase db reset"
alias spdp="supabase db push"
alias spdul="supabase db pull"
alias spdd="supabase db diff"

# Migration-specific aliases
alias spmn="supabase migration new"
alias spmu="supabase migration up"
alias spmd="supabase migration down"
alias spml="supabase migration list"

# Function-specific aliases
alias spfd="supabase functions deploy"
alias spfs="supabase functions serve"
alias spfl="supabase functions list"

# Enable completion for new aliases
compdef spdr='supabase db reset'
compdef spdp='supabase db push'
compdef spdul='supabase db pull'
compdef spdd='supabase db diff'
compdef spmn='supabase migration new'
compdef spmu='supabase migration up'
compdef spmd='supabase migration down'
compdef spml='supabase migration list'
compdef spfd='supabase functions deploy'
compdef spfs='supabase functions serve'
compdef spfl='supabase functions list'

EOF

# Reload shell
source ~/.zshrc
```

### **Custom Completion Functions**

```bash
# Add custom completion for common patterns
cat >> ~/.zshrc << 'EOF'

# Custom function for migration names
_supabase_migration_names() {
  local suggestions=(
    "add_table"
    "update_schema"
    "create_function"
    "add_rls_policy"
    "insert_seed_data"
    "add_index"
    "update_constraints"
  )
  _describe 'migration names' suggestions
}

# Bind custom completion to migration new command
compdef '_supabase_migration_names' spmn

EOF
```

---

## 🛠 **Troubleshooting**

### **Completion Not Working?**

```bash
# Check if completion is loaded
echo $fpath | grep supabase

# Reload shell completions
autoload -U compinit && compinit

# Rebuild completion cache
rm ~/.zcompdump* && compinit

# Check if supabase is in PATH
which supabase
```

### **Oh-My-Zsh Plugin Issues**

```bash
# Check if plugin directory exists
ls -la ~/.oh-my-zsh/custom/plugins/supabase/

# Verify plugin is in .zshrc
grep "plugins=" ~/.zshrc

# Check Oh-My-Zsh is loading custom plugins
echo $ZSH_CUSTOM
```

### **Aliases Not Working?**

```bash
# Check if aliases are defined
alias | grep sp

# Manually source .zshrc
source ~/.zshrc

# Check for conflicts
which sp
```

---

## 📋 **Quick Installation Script**

Save this as `setup-supabase-completion.sh` and run it:

```bash
#!/bin/bash

echo "🚀 Setting up Supabase completion and aliases..."

# Generate completion
supabase completion zsh > ~/.supabase-completion.zsh

# Add to .zshrc if not already present
if ! grep -q "supabase-completion.zsh" ~/.zshrc; then
  echo "" >> ~/.zshrc
  echo "# Supabase CLI completion and aliases" >> ~/.zshrc
  echo "source ~/.supabase-completion.zsh" >> ~/.zshrc
  echo "" >> ~/.zshrc
  echo "# Supabase aliases" >> ~/.zshrc
  echo 'alias sp="supabase"' >> ~/.zshrc
  echo 'alias spm="supabase migration"' >> ~/.zshrc
  echo 'alias spdb="supabase db"' >> ~/.zshrc
  echo 'alias spfn="supabase functions"' >> ~/.zshrc
  echo 'alias spst="supabase status"' >> ~/.zshrc
  echo "" >> ~/.zshrc
  echo "# Enable completion for aliases" >> ~/.zshrc
  echo "compdef sp=supabase" >> ~/.zshrc
  echo "compdef spm='supabase migration'" >> ~/.zshrc
  echo "compdef spdb='supabase db'" >> ~/.zshrc
  echo "compdef spfn='supabase functions'" >> ~/.zshrc
  echo "compdef spst='supabase status'" >> ~/.zshrc
fi

echo "✅ Setup complete! Run 'source ~/.zshrc' to activate."
echo ""
echo "Test with:"
echo "  sp[TAB]     - Should complete to 'supabase'"
echo "  sp db [TAB] - Should show database commands"
echo "  spm list    - Should show migration list"
```

```bash
# Make executable and run
chmod +x setup-supabase-completion.sh
./setup-supabase-completion.sh
source ~/.zshrc
```

---

## 🎯 **Summary of Aliases**

| Alias | Command | Description |
|-------|---------|-------------|
| `sp` | `supabase` | Main command |
| `spm` | `supabase migration` | Migration commands |
| `spdb` | `supabase db` | Database commands |
| `spfn` | `supabase functions` | Function commands |
| `spst` | `supabase status` | Status check |

### **Extended Aliases**

| Alias | Command | Description |
|-------|---------|-------------|
| `spdr` | `supabase db reset` | Reset database |
| `spdp` | `supabase db push` | Push to remote |
| `spdul` | `supabase db pull` | Pull from remote |
| `spdd` | `supabase db diff` | Show differences |
| `spmn` | `supabase migration new` | Create new migration |
| `spmu` | `supabase migration up` | Apply migrations |
| `spmd` | `supabase migration down` | Rollback migrations |
| `spml` | `supabase migration list` | List migrations |
| `spfd` | `supabase functions deploy` | Deploy function |
| `spfs` | `supabase functions serve` | Serve functions locally |
| `spfl` | `supabase functions list` | List functions |

### **Usage Examples**

```bash
# Instead of: supabase migration new add_users
spmn add_users

# Instead of: supabase db push --confirm
spdp --confirm

# Instead of: supabase functions deploy my-function
spfd my-function

# Instead of: supabase status
spst
```

---

## 🔍 **What is Tab Completion?**

Tab completion is a feature that allows you to:

- **Auto-complete commands** by pressing the Tab key
- **Discover available options** without memorizing them
- **Reduce typing errors** and increase productivity
- **Navigate command hierarchies** efficiently

### **How It Works**

1. **Type partial command**: `sp db p`
2. **Press Tab**: `sp db push`
3. **Press Tab twice**: Shows all available flags like `--confirm`, `--include-seed`
4. **Continue typing**: `sp db push --conf` + Tab = `sp db push --confirm`

### **Command Discovery**

```bash
# Discover all supabase commands
sp [TAB][TAB]

# Output shows:
# db          functions   gen         link        login
# migration   projects    start       status      stop
```

### **Flag Discovery**

```bash
# See all flags for a command
sp migration up --[TAB][TAB]

# Output shows:
# --debug     --target    --help      --version
```

---

## 🎉 **Why This Setup is Powerful**

### **Before Setup (Traditional Way)**
```bash
# 47 keystrokes
supabase migration new add_user_profile_table
```

### **After Setup (With Completion & Aliases)**
```bash
# 19 keystrokes + 3 Tab presses
spm[TAB] new[TAB] add_user[TAB]
```

### **Time Savings**
- **60% fewer keystrokes** on common commands
- **Zero typos** with tab completion
- **Instant command discovery** without documentation
- **Faster development workflow**

---

This setup will significantly speed up your Supabase CLI workflow with tab completion and convenient aliases! 🚀
