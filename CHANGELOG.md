# v3.3.4

Changes are not detailed here. For more information, see: https://github.com/rozsazoltan/echoscreen/compare/v3.3.3...v3.3.4


# v3.3.3

* feat: add new version notification dialog on startup (removed from settings)
* style: format settings panel menu
* style: update link color
* test: add prev/next buttons for development

For more information, see: https://github.com/rozsazoltan/echoscreen/compare/v3.0.0...v3.3.3


# v3.0.0 (February 2025)

I am not committing to active maintenance. The project's structure is outdated. However, I am making some contributions that may improve the user experience.

### New
* Added Hungarian language

### Changed
* Removed random PIN – While the feature is useful, it doesn't make sense on a local network. The sharing process already requires accepting the connection request in the server software.
    * Static fixed PIN: `123456` – This could possibly be expanded later with an input field.
* The repository URL has been changed to check for updates.

### Removed
* Removed support buttons – The original project hasn't received any meaningful updates in three years, so there is nothing left to support.
* Removed startup banner – While it's for a good cause, having to close it on every startup is irritating, and it only encourages further support for a project that has been inactive for three years.
* Removed QR code – While useful, I rarely share the screen to a mobile device, so scanning the code is too much work in 99% of cases.

To avoid any misunderstandings, I have placed links to my own name and repository starting from v3.0.0, but you can still navigate from the repository to the project's 2022 maintenance.


# v2.0.4 (November 2022)

The last known release of the original project. It can start a screen-sharing session, which can then be accessed from another browser within the same network. The sharing is protected by a randomly generated PIN.
