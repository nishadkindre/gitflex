import React from 'react';
import { motion } from 'framer-motion';
import { Github, Heart, ExternalLink, Code, GitFork, Star, Database } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Github size={16} className="text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">GitFlex</span>
            </motion.div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transform your GitHub profile into a beautiful, professional showcase. Discover the power of modern design and elegant data visualization.
            </p>
          </div>

          {/* GitHub Project - right end */}
          <div className="col-span-1 md:col-span-1 md:col-start-3 md:justify-self-end">
            <h3 className="font-semibold text-foreground mb-4">GitHub Project</h3>
            <ul className="space-y-3">
              {[
                {
                  name: 'View Repository',
                  href: 'https://github.com/nishadkindre/gitflex',
                  icon: <Code size={14} />,
                  description: 'Check out the source code'
                },
                {
                  name: 'Contribute',
                  href: 'https://github.com/nishadkindre/gitflex/contribute',
                  icon: <GitFork size={14} />,
                  description: 'Help improve the project'
                },
                {
                  name: 'Star on GitHub',
                  href: 'https://github.com/nishadkindre/gitflex',
                  icon: <Star size={14} />,
                  description: 'Show your support'
                },
                {
                  name: 'Github APIs',
                  href: 'https://docs.github.com/en/rest',
                  icon: <Database size={14} />,
                  description: 'Explore the API documentation'
                }
              ].map((link, index) => (
                <motion.li key={link.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-start space-x-2 group"
                  >
                    <span className="text-primary mt-0.5 group-hover:scale-110 transition-transform">{link.icon}</span>
                    <div>
                      <div className="flex items-center">
                        <span>{link.name}</span>
                        <ExternalLink size={10} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      {/* <p className="text-xs text-muted-foreground/70 mt-0.5">{link.description}</p> */}
                    </div>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>© {currentYear} GitFlex</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            {/* <motion.div
              className="h-4 w-px bg-border"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            /> */}
            <span>
              Made with ❤️ by &nbsp;
              <motion.a href="https://github.com/nishadkindre" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Nishad Kindre
              </motion.a>
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
