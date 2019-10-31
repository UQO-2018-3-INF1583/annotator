import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CreateProjectService } from "../../../services";

import { Project, ProjectUtils } from "../../../models/project/project.model";

export enum CreationStatus {
  NotSubmitted,
  InProgress,
  Success,
  Error
}

interface CreationDetails {
  status: CreationStatus;
  message: string;
}

@Component({
  selector: "app-create-project",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.scss"],
  providers: [CreateProjectService]
})
export class CreateProjectComponent implements OnInit {
  project: Project = ProjectUtils.generateEmpty();
  // make the enum a property of the component class
  creationStatus = CreationStatus;
  creationDetails: CreationDetails = {
    status: CreationStatus.NotSubmitted,
    message: ""
  };

  constructor(
    public router: Router,
    private cps: CreateProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.creationDetails.status = CreationStatus.NotSubmitted;
  }

  create() {
    if (
      this.project.title != null &&
      this.project.title !== "" &&
      this.project.description != null &&
      this.project.description !== ""
    ) {
      this.creationDetails.status = CreationStatus.InProgress;
      this.creationDetails.message = "Attempting to save..";

      this.cps.projectNameExists(this.project).then(exists => {
        if (exists) {
          this.creationDetails.status = CreationStatus.Error;
          this.creationDetails.message = `A project with the name "${this.project.title}" already exists.`;
        } else {
          this.cps.createNewProject(this.project);
          this.creationDetails.status = CreationStatus.Success;
          this.creationDetails.message = `Project saved successfully!`;
          this.router.navigate(["/projectManager"]);
        }
      });
    }
  }
}
