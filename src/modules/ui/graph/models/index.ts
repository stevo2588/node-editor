import { NodeModel } from "./model";


export class CodeModel extends NodeModel {
  static type = 'code';
  readonly defaultInputs = ['code']; // TODO: enum
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, CodeModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeGenModel extends NodeModel {
  static type = 'codeGen';
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, CodeGenModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class TestModel extends NodeModel {
  static type = 'test';
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, TestModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildModel extends NodeModel {
  static type = 'build';
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, BuildModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceModel extends NodeModel {
  static type = 'service';
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, ServiceModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceHostModel extends NodeModel {
  static type = 'serviceHost';
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, ServiceHostModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ApiMapperModel extends NodeModel {
  static type = 'apiMapper';
  root = true;
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, ApiMapperModel.type, 'untitled', 'purple');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeContainerModel extends NodeModel {
  static type = 'codeContainer';
  readonly contains = ['code', 'codeGen'];
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(true, CodeContainerModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildContainerModel extends NodeModel {
  static type = 'buildContainer';
  static readonly root = true;
  static readonly contains = ['test', 'build', 'codeContainer'];
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(true, BuildContainerModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceContainerModel extends NodeModel {
  static type = 'serviceContainer';
  static readonly root = true;
  static readonly contains = ['service', 'serviceHost', 'apiMapper', 'serviceContainer'];
  readonly defaultInputs = ['code'];
  readonly additionalInputs = ['code'];
  readonly defaultOutputs = ['code'];
  readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(true, ServiceContainerModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}
